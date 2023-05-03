import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Categories } from '../../entities/categories.entity';
import { Tags } from '../../entities/tags.entity';
import { Memos } from '../../entities/memos.entity';
import {
  CreateMemoInputDto,
  CreateMemoOutputDto,
  MemoIdInputDto,
  GetMemosInput,
  GetMemosOutput,
} from './dtos/memo.dto';
import { CoreOutput } from '../../common/dtos/coreOutput.dto';
import { User } from '../../entities/user.entity';
import {
  CreateCateInput,
  CreateCateOutput,
  CateInput,
  CateIdInput,
  ImportantMemoLengthOutput,
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

  async getAsideData(user: User): Promise<AsideDataOutput> {
    try {
      const categories = await this.categoriesRepository
        .createQueryBuilder()
        .where('Categories.userId = :userId', { userId: user.id })
        .getMany();

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
        .orderBy('Tags.tagName, Tags.cateId, Tags.id')
        .getRawMany();

      const tagsLength = getTagsInCate.length;

      const cate = categories.map((cate) => ({
        cateName: cate.cateName,
        cateId: cate.id,
      }));

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
        .leftJoinAndSelect('Memos.tags', 'tags')
        .where('userId = :userId', { userId: user.id });

      if (input.search) {
        qb.andWhere(
          `Memo.title LIKE '%:search%' OR Memo.contents LIKE '%:search%'`,
          { search: input.search },
        );
      }

      if (input.cateQueryStr) {
        qb.andWhere('Memo.cateId = :cateId', { cateId: input.cateQueryStr });
      }
      if (input.menuQueryStr) {
        qb.andWhere('important = :important', { important: true });
      }
      if (input.tagQueryStr) {
        qb.andWhere('tags.tagName = :tagName', { tagName: input.tagQueryStr });
      }

      const memosLength = await qb.getCount();

      const importantMemoLength = await qb
        .andWhere('important = :important', { important: true })
        .getCount();

      const tagsLength = await this.tagsRepository
        .createQueryBuilder()
        .select(['MIN(id) AS id', 'tagName AS tagName', 'id AS cateId'])
        .where('userId = :userId', { userId: user.id })
        .groupBy('tagName, tags.cateId')
        .orderBy('tagName, cateId, id')
        .getCount();

      const result = await qb.skip(input.offset).take(input.limit).getMany();

      const memos = result.map((memos) => {
        const {
          id: memoId,
          cateId,
          title,
          content,
          updateAt,
          important,
          tags: getTags,
        } = memos;
        const tags = getTags.map((tag) => ({
          tagId: tag.id,
          memoId: tag.memoId,
          cateId: tag.cateId,
          tagName: tag.tagName,
        }));
        return { memoId, cateId, title, content, updateAt, important, tags };
      });

      return {
        success: true,
        memos,
        memosLength,
        importantMemoLength,
        tagsLength,
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
      if (input.cateName === '') {
        return { success: true };
      }

      //중복 검증
      const exists = await this.categoriesRepository.findOne({
        where: [{ cateName: input.cateName }],
      });

      if (exists) {
        return {
          success: false,
          error: `중복된 카테고리입니다.`,
        };
      }

      const saveCate = await this.categoriesRepository.save(
        this.categoriesRepository.create({ cateName: input.cateName, user }),
      );

      return {
        success: true,
        message: '새 카테고리가 생성되었습니다',
        savedCate: { cateName: saveCate.cateName, cateId: saveCate.id },
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
      // where조건엔 맞지만 andWhere조건이 맞지않는경우 false
      const exists = await this.categoriesRepository
        .createQueryBuilder('categories')
        .where('categories.id != :cateId', { cateId: input.cateId })
        .getOne();

      if (exists)
        return { success: false, error: '이미 존재하는 카테고리 이름입니다.' };

      await this.categoriesRepository.update(input.cateId, {
        cateName: input.cateName,
      });

      return { success: true, message: 'cate 업데이트완료' };
    } catch (e) {
      return { success: false, error: `${e}` };
    }
  }

  async deleteCate(
    input: CateIdInput,
    user: User,
  ): Promise<ImportantMemoLengthOutput> {
    try {
      const getImportantMemoLength = await this.memoRepository
        .createQueryBuilder('memos')
        .where('memos.important = :important', { important: 1 })
        .select('COUNT(*) AS importantMemoCount')
        .getRawOne();

      const importantMemoLength = getImportantMemoLength.importantMemoCount;

      await this.categoriesRepository.delete(input.cateId);
      return {
        success: true,
        message: '해당 카테고리가 삭제되었습니다.',
        importantMemoLength,
      };
    } catch (e) {
      return { success: false, error: `${e}` };
    }
  }

  async createMemo(
    input: CreateMemoInputDto,
    user: User,
  ): Promise<CreateMemoOutputDto> {
    try {
      const saveMemo = await this.memoRepository.save(
        this.memoRepository.create({
          title: input.title,
          content: input.content,
          important: input.important,
          cate: { id: input.cateId },
          user,
        }),
      );

      let newTags = [];

      if (input.tags.length !== 0) {
        newTags = await Promise.all(
          input.tags.map(async (tag) => {
            return await this.tagsRepository.save(
              this.tagsRepository.create({
                tagName: tag.tagName,
                user,
                memos: { id: saveMemo.id },
                cate: { id: input.cateId },
              }),
            );
          }),
        );
      }

      return {
        success: true,
        newMemoId: saveMemo.id,
        updateAt: saveMemo.updateAt,
        newTags: newTags.map((tags) => {
          return {
            tagId: tags.id,
            tagName: tags.tagName,
            cateId: tags.cateId,
            memoId: tags.memoId,
          };
        }),
      };
    } catch (e) {
      return {
        success: false,
        error: `${e}`,
      };
    }
  }
  async changeImportant(
    input: MemoIdInputDto,
    user: User,
  ): Promise<ImportantMemoLengthOutput> {
    try {
      const targetMemo = await this.memoRepository.findOneOrFail({
        where: { id: input.memoId },
      });

      await this.memoRepository.update(input.memoId, {
        important: !targetMemo.important,
      });

      const getImportantMemoLength = await this.memoRepository
        .createQueryBuilder('memos')
        .where('memos.important = :important', { important: 1 })
        .select('COUNT(*) AS importantMemoCount')
        .getRawOne();

      const importantMemoLength = getImportantMemoLength.importantMemoCount;

      return {
        success: true,
        message: 'changed important',
        importantMemoLength,
      };
    } catch (e) {
      return {
        success: false,
        error: `${e}`,
      };
    }
  }
}
