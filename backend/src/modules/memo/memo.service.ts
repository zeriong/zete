import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categories } from '../../entities/categories.entity';
import { Tags } from '../../entities/tags.entity';
import { Memos } from '../../entities/memos.entity';
import {
  CreateMemoOutput,
  MemoIdInput,
  GetMemosInput,
  GetMemosOutput,
  CreateMemoInput,
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
    @InjectRepository(Categories)
    private readonly categoriesRepository: Repository<Categories>,
    @InjectRepository(Memos)
    private readonly memoRepository: Repository<Memos>,
    @InjectRepository(Tags)
    private readonly tagsRepository: Repository<Tags>,
  ) {}

  async getCategories(user: User): Promise<Categories[]> {
    const result = await this.categoriesRepository
      .createQueryBuilder()
      .where('Categories.userId = :userId', { userId: user.id })
      .getMany();
  }

  async getAsideData(user: User): Promise<AsideDataOutput> {
    try {
      const cateQb = await this.categoriesRepository
        .createQueryBuilder()
        .where('Categories.userId = :userId', { userId: user.id });

      const cate = await cateQb.getMany();

      const memosQb = await this.memoRepository
        .createQueryBuilder()
        .where('Memos.userId = :userId', { userId: user.id });

      const memosLength = await memosQb.getCount();

      const importantMemoLength = await memosQb
        .andWhere('Memos.important = :important', { important: true })
        .getCount();

      const getMemoLengthInCate = await memosQb
        .select('Memos.cateId, COUNT(*) AS length')
        .groupBy('Memos.cateId')
        .getRawMany();

      const getTagsInCate = await this.tagsRepository
        .createQueryBuilder()
        .select([
          'MIN(Tags.id) AS id',
          'Tags.tagName AS tagName',
          'Tags.cateId AS cateId',
        ])
        .where('Tags.userId = :userId', { userId: user.id })
        .groupBy('Tags.tagName, Tags.cateId')
        .getRawMany();

      const tagsLength = getTagsInCate.length;

      const tagsInCate = getTagsInCate
        .filter((tag) => tag.cateId !== null)
        .map((tags) => ({ tagName: tags.tagName, cateId: tags.cateId }));

      const memoLengthInCate = getMemoLengthInCate.map((inCate) => ({
        cateId: inCate.cateId,
        length: Number(inCate.length),
      }));

      return {
        success: true,
        asideData: {
          cate,
          tagsInCate,
          importantMemoLength,
          memosLength,
          memoLengthInCate,
          tagsLength,
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
        .leftJoinAndSelect('Memos.tag', 'tags')
        .where('Memos.userId = :userId', { userId: user.id })
        .orderBy('Memos.updateAt', 'DESC'); // updateAt 내림차순 정렬

      const memosLength = await qb.getCount();

      const importantMemoLength = await qb
        .andWhere('important = :important', { important: true })
        .getCount();

      const tagsLength = await this.tagsRepository
        .createQueryBuilder()
        .select(['MIN(id) AS id', 'tagName AS tagName', 'id AS cateId'])
        .where('userId = :userId', { userId: user.id })
        .groupBy('tagName, tag.cateId')
        .orderBy('tagName, cateId, id')
        .getCount();

      const cateLength = await this.categoriesRepository
        .createQueryBuilder()
        .where('userId = :userId', { userId: user.id })
        .getCount();

      if (input.search) {
        const findSearch = await qb
          .where('Memos.userId = :userId', { userId: user.id })
          .andWhere('Memos.title LIKE :search OR Memos.content LIKE :search', {
            search: `%${input.search}%`,
          })
          .skip(input.offset)
          .take(input.limit)
          .getMany();

        return {
          success: true,
          memos: findSearch,
          memosLength,
          importantMemoLength,
          tagsLength,
          cateLength,
        };
      }
      // 변수초기화 (important갯수를 반환해주기 위해서 where문의 조건이 변경되기 때문)
      qb.where('Memos.userId = :userId', { userId: user.id });

      if (input.cateQueryStr) {
        qb.andWhere('Memo.cateId = :cateId', { cateId: input.cateQueryStr });
      }
      if (input.menuQueryStr) {
        qb.andWhere('Memos.important = :important', { important: true });
      }
      if (input.tagQueryStr) {
        qb.andWhere('tag.tagName = :tagName', { tagName: input.tagQueryStr });
      }

      const result = await qb.skip(input.offset).take(input.limit).getMany();

      return {
        success: true,
        memos: result,
        memosLength,
        importantMemoLength,
        tagsLength,
        cateLength,
      };
    } catch (e) {
      return { success: false, error: `${e}` };
    }
  }

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
        const importantMemoLength = await this.memoRepository
          .createQueryBuilder()
          .where('Memos.important = :important', { important: true })
          .getCount();

        return { success: true, importantMemoLength };
      }
    } catch (e) {
      return { success: false, error: `${e}` };
    }
  }

  async createMemo(
    input: CreateMemoInput,
    user: User,
  ): Promise<CreateMemoOutput> {
    try {
      if (!input.content && !input.title) {
        return { success: false, error: '메모를 입력해주세요.' };
      }
      const result = await this.memoRepository.save(
        this.memoRepository.create({
          title: input.title,
          content: input.content,
          important: input.important,
          cate: { id: input.cateId || null },
          user,
          tag: input.tags || [],
        }),
      );
      console.log('스탭1');

      console.log('스탭3');
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
        const importantMemoLength = await this.memoRepository
          .createQueryBuilder('memos')
          .where('memo.important = :important', { important: true })
          .getCount();

        return {
          success: true,
          importantMemoLength,
        };
      }
    } catch (e) {
      return {
        success: false,
        error: `${e}`,
      };
    }
  }
}
