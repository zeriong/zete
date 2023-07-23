import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Category } from '../../entities/category.entity';
import { Tag } from '../../entities/tag.entity';
import { Memo } from '../../entities/memo.entity';
import {
  CreateMemoOutput,
  MemoIdInput,
  GetMemosInput,
  GetMemosOutput,
  CreateMemoInput,
  UpdateMemoInput,
  GetOneMemoOutput,
} from './dtos/memo.dto';
import { CoreOutput } from '../../common/dtos/coreOutput.dto';
import { User } from '../../entities/user.entity';
import {
  CreateCateInput,
  CreateCateOutput,
  CateIdInput,
  ImportantMemoLengthOutput,
  CateInput,
} from './dtos/cate.dto';
import { AsideDataOutput } from './dtos/asideData.dto';

@Injectable()
export class MemoService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    @InjectRepository(Memo)
    private readonly memoRepository: Repository<Memo>,
    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>,
  ) {}

  /** getData ===================================================== */

  // async getAsideData(user: User): Promise<AsideDataOutput> {
  //   try {
  //     const cateQb = await this.categoriesRepository
  //       .createQueryBuilder()
  //       .where('Category.userId = :userId', { userId: user.id });
  //
  //     const cateCount = await cateQb.getCount();
  //
  //     const cate = await cateQb
  //       .leftJoinAndSelect('Category.tag', 'tag')
  //       .loadRelationCountAndMap('Category.memoCount', 'Category.memo')
  //       .groupBy('Category.id, tag.tagName')
  //       .getMany();
  //
  //     const memosQb = await this.memoRepository
  //       .createQueryBuilder()
  //       .where('Memo.userId = :userId', { userId: user.id });
  //
  //     const memosCount = await memosQb.getCount();
  //
  //     const importantMemoCount = await memosQb
  //       .andWhere('Memo.important = :important', { important: true })
  //       .getCount();
  //
  //     return {
  //       success: true,
  //       asideData: {
  //         cate,
  //         cateCount,
  //         importantMemoCount,
  //         memosCount,
  //       },
  //     };
  //   } catch (e) {
  //     return {
  //       success: false,
  //       error: `데이터를 받아오지 못했습니다. error: ${e}`,
  //     };
  //   }
  // }

  async getAsideData(user: User): Promise<AsideDataOutput> {
    try {
      const cate = await this.categoriesRepository
        .createQueryBuilder('category')
        .leftJoinAndSelect('category.tag', 'tag')
        .loadRelationCountAndMap('category.memoCount', 'category.memo')
        .where('category.userId = :userId', { userId: user.id })
        .groupBy('category.id, tag.tagName')
        .getMany();

      const memosCount = await this.memoRepository
        .createQueryBuilder('memo')
        .where('memo.userId = :userId', { userId: user.id })
        .getCount();

      const importantMemoCount = await this.memoRepository
        .createQueryBuilder('memo')
        .where('memo.userId = :userId', { userId: user.id })
        .andWhere('memo.important = :important', { important: true })
        .getCount();

      const cateCount = cate.length;

      return {
        success: true,
        asideData: {
          cate,
          cateCount,
          importantMemoCount,
          memosCount,
        },
      };
    } catch (e) {
      return {
        success: false,
        error: `데이터를 받아오지 못했습니다. error: ${e}`,
      };
    }
  }

  async getMemos(input: GetMemosInput, user: User): Promise<GetMemosOutput> {
    try {
      const qb = this.memoRepository
        .createQueryBuilder()
        .leftJoinAndSelect('Memo.tag', 'tags')
        .where('Memo.userId = :userId', { userId: user.id })
        .orderBy('Memo.updateAt', 'DESC'); // updateAt 내림차순 정렬

      const memosCount = await qb.getCount();

      const importantMemoCount = await qb
        .clone()
        .andWhere('important = :important', { important: true })
        .getCount();

      let findSearch: SelectQueryBuilder<Memo>;
      if (input.search) {
        findSearch = await qb
          .clone()
          .andWhere('Memo.title LIKE :search OR Memo.content LIKE :search', {
            search: `%${input.search}%`,
          });
      }
      if (input.cateQueryStr) {
        qb.andWhere('Memo.cateId = :cateId', { cateId: input.cateQueryStr });
      }
      if (input.menuQueryStr) {
        qb.andWhere('Memo.important = :important', { important: true });
      }
      if (input.tagQueryStr) {
        qb.andWhere(
          `Memo.id IN ${qb
            .subQuery()
            .from('Tag', 'tag')
            .select('tag.memoId')
            .where(
              'tag.tagName = :tagName AND tag.userId = :userId AND tag.cateId = :cateId',
              {
                tagName: input.tagQueryStr,
                userId: user.id,
                cateId: input.cateQueryStr,
              },
            )
            .getQuery()}`,
        );
      }

      const memos = input.search
        ? await findSearch.skip(input.offset).take(input.limit).getMany()
        : await qb.skip(input.offset).take(input.limit).getMany();

      return {
        success: true,
        memos,
        memosCount,
        importantMemoCount,
      };
    } catch (e) {
      return { success: false, error: `${e}` };
    }
  }

  async getOneMemo(input: MemoIdInput, user: User): Promise<GetOneMemoOutput> {
    try {
      const memo = await this.memoRepository
        .createQueryBuilder()
        .leftJoinAndSelect('Memo.tag', 'tags')
        .where('Memo.userId = :userId AND Memo.id = :memoId', {
          userId: user.id,
          memoId: input.memoId,
        })
        .getOne();

      return { success: true, memo };
    } catch (e) {
      return { success: false, error: `${e}` };
    }
  }

  /** Category ======================================================================= */

  async createCategory(
    input: CreateCateInput,
    user: User,
  ): Promise<CreateCateOutput> {
    try {
      if (!input.cateName) {
        return { success: false };
      }

      //중복 검증
      const exists = await this.categoriesRepository
        .createQueryBuilder()
        .where('userId = :userId AND cateName = :cateName', {
          userId: user.id,
          cateName: input.cateName,
        })
        .getOne();

      if (exists) {
        return {
          success: false,
          error: `이미 존재하는 카테고리 이름입니다.`,
        };
      }

      const result = await this.categoriesRepository.save(
        this.categoriesRepository.create({ cateName: input.cateName, user }),
      );

      return {
        success: true,
        message: '새 카테고리가 생성되었습니다',
        savedCate: result,
      };
    } catch (e) {
      return { success: false, error: `${e}` };
    }
  }

  async updateCategory(input: CateInput, user: User): Promise<CoreOutput> {
    try {
      if (input.cateName === '') {
        return {
          success: false,
          error: '비어있는 카테고리를 삭제하거나 수정할 이름을 입력하세요.',
        };
      }

      const result = await this.categoriesRepository
        .createQueryBuilder()
        .update({ cateName: input.cateName })
        .where('id = :id AND userId = :userId', {
          id: input.cateId,
          userId: user.id,
        })
        .execute();

      if (result.affected > 0) {
        return { success: true };
      } else {
        return { success: false, error: '해당카테고리는 존재하지 않습니다.' };
      }
    } catch (e) {
      return { success: false, error: `${e}` };
    }
  }

  async deleteCategory(
    input: CateIdInput,
    user: User,
  ): Promise<ImportantMemoLengthOutput> {
    try {
      const result = await this.categoriesRepository
        .createQueryBuilder()
        .delete()
        .where('id = :id AND userId = :userId', {
          id: input.cateId,
          userId: user.id,
        })
        .execute();

      if (result.affected > 0) {
        const importantMemoCount = await this.memoRepository
          .createQueryBuilder()
          .where('Memo.important = :important', { important: true })
          .getCount();

        return { success: true, importantMemoCount };
      }
    } catch (e) {
      return { success: false, error: `${e}` };
    }
  }

  /** Memo =============================================================== */

  async createMemo(
    input: CreateMemoInput,
    user: User,
  ): Promise<CreateMemoOutput> {
    try {
      if (!input.content && !input.title) {
        return { success: false, error: '메모를 입력해주세요.' };
      }

      const tags: Tag[] = input.tags.map((tag) => ({
        tagName: tag.tagName,
        user,
        cate: { id: input.cateId || null },
      }));

      const result = await this.memoRepository.save(
        this.memoRepository.create({
          title: input.title,
          content: input.content,
          important: input.important,
          cate: { id: input.cateId || null },
          user,
          tag: tags || [],
        }),
      );

      return {
        success: true,
        savedMemo: result,
      };
    } catch (e) {
      return {
        success: false,
        error: `${e}`,
      };
    }
  }

  async updateMemo(input: UpdateMemoInput, user: User): Promise<CoreOutput> {
    try {
      if (!input.memo.content && !input.memo.title) {
        return { success: false, error: '메모를 입력해주세요.' };
      }
      if (input.deleteTagIds.length > 0) {
        input.deleteTagIds.forEach((id) => this.tagsRepository.delete(id));
      }

      if (input.newTags.length > 0) {
        const newTags = input.newTags.map((tag) => ({
          ...tag,
          memo: { id: input.memo.id },
          cate: { id: input.memo.cateId },
          user,
        }));

        await this.tagsRepository.save(
          newTags.map((tag) => this.tagsRepository.create(tag)),
        );
      }

      const updateMemo = await this.memoRepository
        .createQueryBuilder()
        .update({
          cate: { id: input.memo.cateId || null },
          title: input.memo.title,
          content: input.memo.content,
          important: input.memo.important,
        })
        .where('userId = :userId AND id = :id', {
          userId: user.id,
          id: input.memo.id,
        })
        .execute();

      if (updateMemo.affected > 0) {
        return { success: true };
      } else {
        return { success: false, error: '해당메모는 존재하지 않습니다.' };
      }
    } catch (e) {
      return { success: false, error: `${e}` };
    }
  }

  async deleteMemo(input: MemoIdInput, user: User): Promise<CoreOutput> {
    try {
      if (!input.memoId) {
        return { success: false, error: '이미 삭제된 메모입니다.' };
      }

      const deleteMemo = await this.memoRepository
        .createQueryBuilder()
        .delete()
        .where('userId = :userId AND id = :id', {
          userId: user.id,
          id: input.memoId,
        })
        .execute();

      if (deleteMemo.affected > 0) {
        return { success: true, message: '메모가 삭제되었습니다.' };
      } else {
        return { success: false, error: '메모삭제에 실패했습니다.' };
      }
    } catch (e) {
      return { success: false, error: `${e}` };
    }
  }

  async changeImportant(
    input: MemoIdInput,
    user: User,
  ): Promise<ImportantMemoLengthOutput> {
    try {
      const result = await this.memoRepository
        .createQueryBuilder()
        .update({ important: () => 'NOT important' })
        .where('id = :id AND userId = :userId', {
          id: input.memoId,
          userId: user.id,
        })
        .execute();

      if (result.affected > 0) {
        const importantMemoCount = await this.memoRepository
          .createQueryBuilder()
          .where('important = :important', { important: true })
          .getCount();

        return { success: true, importantMemoCount };
      } else {
        return { success: false, error: '해당메모는 존재하지 않습니다.' };
      }
    } catch (e) {
      return {
        success: false,
        error: `${e}`,
      };
    }
  }
}
