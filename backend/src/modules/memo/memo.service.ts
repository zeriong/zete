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
  PaginationInputDto,
  PaginationOutputDto,
} from './dtos/memo.dto';
import { CoreOutput } from '../../common/dtos/coreOutput.dto';
import { User } from '../../entities/user.entity';
import {
  CreateCateInputDto,
  CreateCateOutputDto,
  UpdateManyCateInputDto,
  CateInputDto,
  CateIdInputDto,
  ImportantMemoLengthOutputDto,
} from './dtos/cate.dto';
import { SendDefaultDataOutputDto } from './dtos/sendContentData.dto';

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

  async sendDefaultData(user: User): Promise<SendDefaultDataOutputDto> {
    try {
      const getMemosLength = await this.memoRepository
        .createQueryBuilder('memos')
        .select('COUNT(*) AS memoCount')
        .getRawOne();

      const getImportantMemoLength = await this.memoRepository
        .createQueryBuilder('memos')
        .where('memos.important = :important', { important: 1 })
        .select('COUNT(*) AS importantMemoCount')
        .getRawOne();

      const cate = await this.categoriesRepository
        .createQueryBuilder('categories')
        .select(['categories.id', 'categories.cateName'])
        .where('categories.userId = :userId', { userId: user.id })
        .getMany();

      const findTags = await this.tagsRepository
        .createQueryBuilder('tags')
        .select('MIN(tags.id)', 'id')
        .addSelect('tags.tagName', 'tagName')
        .addSelect('tags.cateId', 'cateId')
        .where('tags.userId = :userId', { userId: user.id })
        .groupBy('tags.tagName, tags.cateId')
        .orderBy('tags.tagName, tags.cateId, tags.id')
        .getRawMany();

      const memoLengthInCate = await this.memoRepository
        .createQueryBuilder('memos')
        .select('memos.cateId, COUNT(*) AS length')
        .groupBy('memos.cateId')
        .getRawMany();
      /* 예상 반환데이터 폼
       [
        { cateId: 1, length: 10 },
        { cateId: 2, length: 5 },
        { cateId: 3, length: 3 },
        ...
      ] */

      const importantMemoLength = getImportantMemoLength.importantMemoCount;
      const memosLength = getMemosLength.memoCount;
      const tags = findTags
        .filter((tag) => tag.cateId !== null)
        .map((tags) => ({ tagName: tags.tagName, cateId: tags.cateId }));

      return {
        success: true,
        cate: cate.map((cate) => ({
          cateName: cate.cateName,
          cateId: cate.id,
        })),
        tags,
        importantMemoLength,
        memosLength,
        memoLengthInCate,
      };
    } catch (e) {
      return {
        success: false,
        error: `데이터를 받아오지 못했습니다. error: ${e}`,
      };
    }
  }

  async scrollPagination(
    input: PaginationInputDto,
    user: User,
  ): Promise<PaginationOutputDto> {
    try {
      if (!input.cateQueryStr && !input.tagQueryStr && !input.menuQueryStr) {
        const memos = await this.memoRepository
          .createQueryBuilder('memos')
          .leftJoinAndSelect('memos.tags', 'tag') // OneToMany 관계
          .where('memos.userId = :userId', { userId: user.id })
          .orderBy('memos.id', 'DESC') // 정렬해야 페이징데이터 중복방지
          .skip(input.offset) // 수만큼 건너뛰고 시작
          .take(input.limit) // 페이징 1회 갯수
          .getMany();

        return {
          success: true,
          memos: memos.map((memo) => ({
            updateAt: memo.updateAt,
            memoId: memo.id,
            cateId: memo.cateId,
            title: memo.title,
            content: memo.content,
            important: memo.important,
            tags: memo.tags.map((tag) => ({
              tagId: tag.id,
              cateId: tag.cateId,
              memoId: tag.memoId,
              tagName: tag.tagName,
            })),
          })),
        };
      }

      if (input.menuQueryStr === 'important') {
        const importantMemos = await this.memoRepository
          .createQueryBuilder('memos')
          .leftJoinAndSelect('memos.tags', 'tag')
          .where('memos.userId = :userId', { userId: user.id })
          .andWhere('memos.important = :important', { important: true })
          .orderBy('memos.id', 'DESC')
          .skip(input.offset)
          .take(input.limit)
          .getMany();

        return {
          success: true,
          memos: importantMemos.map((memo) => ({
            updateAt: memo.updateAt,
            memoId: memo.id,
            cateId: memo.cateId,
            title: memo.title,
            content: memo.content,
            important: memo.important,
            tags: memo.tags.map((tag) => ({
              tagId: tag.id,
              cateId: tag.cateId,
              memoId: tag.memoId,
              tagName: tag.tagName,
            })),
          })),
        };
      }

      if (input.cateQueryStr && !input.tagQueryStr) {
        const category = await this.categoriesRepository.findOne({
          where: { id: input.cateQueryStr },
        });

        const categoryId = category.id;

        const cateMemos = await this.memoRepository
          .createQueryBuilder('memos')
          .leftJoinAndSelect('memos.tags', 'tag')
          .where('memos.userId = :userId', { userId: user.id })
          .andWhere('memos.cateId = :cateId', { cateId: categoryId })
          .orderBy('memos.id', 'DESC')
          .skip(input.offset)
          .take(input.limit)
          .getMany();

        return {
          success: true,
          memos: cateMemos.map((memo) => ({
            updateAt: memo.updateAt,
            memoId: memo.id,
            cateId: memo.cateId,
            title: memo.title,
            content: memo.content,
            important: memo.important,
            tags: memo.tags.map((tag) => ({
              tagId: tag.id,
              cateId: tag.cateId,
              memoId: tag.memoId,
              tagName: tag.tagName,
            })),
          })),
        };
      }

      if (input.tagQueryStr) {
        const category = await this.categoriesRepository.findOne({
          where: { id: input.cateQueryStr },
        });
        const tags = await this.tagsRepository.find({
          where: { tagName: input.tagQueryStr },
        });

        const categoryId = category.id;
        const tagsIds = tags.map((tags) => tags.memoId);

        const tagsMemos = await this.memoRepository
          .createQueryBuilder('memos')
          .leftJoinAndSelect('memos.tags', 'tag')
          .where('memos.userId = :userId', { userId: user.id })
          .andWhere('memos.cateId = :cateId', { cateId: categoryId })
          .andWhere('memos.id IN (:...ids)', { ids: tagsIds })
          .orderBy('memos.id', 'DESC')
          .skip(input.offset)
          .take(input.limit)
          .getMany();

        return {
          success: true,
          memos: tagsMemos.map((memo) => ({
            updateAt: memo.updateAt,
            memoId: memo.id,
            cateId: memo.cateId,
            title: memo.title,
            content: memo.content,
            important: memo.important,
            tags: memo.tags.map((tag) => ({
              tagId: tag.id,
              cateId: tag.cateId,
              memoId: tag.memoId,
              tagName: tag.tagName,
            })),
          })),
        };
      }
    } catch (e) {
      return { success: false, error: `${e}` };
    }
  }

  async createCate(
    input: CreateCateInputDto,
    user: User,
  ): Promise<CreateCateOutputDto> {
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

      const cate = await this.categoriesRepository
        .createQueryBuilder('categories') //이 후에 SQL 쿼리로 데이터조회 가능
        .where('categories.userId = :userId', { userId: user.id }) //조회조건
        .getMany(); //해당 조건 모든데이터 반환

      return {
        success: true,
        message: '새 카테고리가 생성되었습니다',
        savedCate: { cateName: saveCate.cateName, cateId: saveCate.id },
      };
    } catch (e) {
      return { success: false, error: `${e}` };
    }
  }

  async updateOneCate(input: CateInputDto): Promise<CoreOutput> {
    try {
      // 프론트에서도 빈문자열 필터링++
      if (input.cateName === '') {
        return {
          success: false,
          error: '비어있는 카테고리를 삭제하거나 수정할 이름을 입력하세요.',
        };
      }
      // where조건엔 맞지만 andWhere조건이 맞지않는경우 false
      const existName = await this.categoriesRepository
        .createQueryBuilder('categories')
        .where('categories.id != :cateId', { cateId: input.cateId })
        .andWhere('categories.cateName = :cateName', {
          cateName: input.cateName,
        })
        .getOne();

      if (existName) {
        return {
          success: false,
          error: '중복된 카테고리가 존재합니다ㅇㅇ',
        };
      }

      await this.categoriesRepository.update(input.cateId, {
        cateName: input.cateName,
      });

      return { success: true, message: 'cate 업데이트완료' };
    } catch (e) {
      return { success: false, error: `${e}` };
    }
  }

  async updateManyCate(input: UpdateManyCateInputDto): Promise<CoreOutput> {
    try {
      // 프론트에서도 빈문자열 필터링++
      const empty = input.data.filter((cate) => cate.cateName === '');

      if (empty.length !== 0) {
        return {
          success: false,
          error: '비어있는 태그를 삭제하거나 수정할 이름을 입력하세요.',
        };
      }

      input.data.map(async (cate) => {
        const exist = await this.categoriesRepository
          .createQueryBuilder('categories')
          .where('categories.id = :cateId', { cateId: cate.cateId })
          .andWhere('categories.cateName = :cateName', {
            cateName: cate.cateName,
          })
          .getOne();

        if (exist) return;

        return this.categoriesRepository.update(cate.cateId, {
          cateName: cate.cateName,
        });
      });

      return { success: true, message: 'cate 업데이트완료' };
    } catch (e) {
      return { success: false, error: `${e}` };
    }
  }

  async deleteCate(
    input: CateIdInputDto,
  ): Promise<ImportantMemoLengthOutputDto> {
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
  ): Promise<ImportantMemoLengthOutputDto> {
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
