import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categories } from '../../entities/categories.entity';
import { Tags } from '../../entities/tags.entity';
import { Memos } from '../../entities/memos.entity';
import { CreateMemoInputDto } from './dtos/memo.dto';
import { CoreOutput } from '../../common/dtos/coreOutput.dto';
import { User } from '../../entities/user.entity';
import {
  CreateCateDto,
  CreateCateOutputDto,
  UpdateManyCateInputDto,
  CateInputDto,
  CateIdInputDto,
} from './dtos/cate.dto';
import { SendContentDataOutputDto } from './dtos/sendContentData.dto';

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

  async sendContentData(user: User): Promise<SendContentDataOutputDto> {
    try {
      console.log(user);
      const cate = await this.categoriesRepository
        .createQueryBuilder('categories')
        .where('categories.userId = :userId', { userId: user.id })
        .getMany();

      const tags = await this.tagsRepository
        .createQueryBuilder('tags')
        .where('tags.userId = :userId', { userId: user.id })
        .getMany();

      const memos = await this.memoRepository
        .createQueryBuilder('memos')
        .where('memos.userId = :userId', { userId: user.id })
        .getMany();

      return { success: true, cate, tags, memos };
    } catch (e) {
      return {
        success: false,
        error: `데이터를 받아오지 못했습니다. error: ${e}`,
      };
    }
  }

  async createCate(
    input: CreateCateDto,
    user: User,
  ): Promise<CreateCateOutputDto> {
    try {
      if (input.cateName === '') {
        return { success: false, error: '카테고리명을 입력해주세요' };
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
        .createQueryBuilder('categories') //이 후에 SQL쿼리언어처럼 DB에서 데이터조회 가능
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
      console.log(input);
      console.log('스탭1');
      // 프론트에서도 빈문자열 필터링++
      const empty = input.data.filter((cate) => cate.cateName === '');

      if (empty.length !== 0) {
        return {
          success: false,
          error: '카테고리에 빈문자열은 추가할 수 없습니다.',
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

  async deleteCate(input: CateIdInputDto): Promise<CoreOutput> {
    try {
      await this.categoriesRepository.delete(input.cateId);
      return { success: true, message: '해당 카테고리가 삭제되었습니다.' };
    } catch (e) {
      return { success: false, error: `${e}` };
    }
  }

  async createMemo(input: CreateMemoInputDto, user: User): Promise<CoreOutput> {
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

      if (input.tags.length !== 0) {
        input.tags.map((tag) => {
          this.tagsRepository.save(
            this.tagsRepository.create({
              tagName: tag,
              user,
              memos: { id: saveMemo.id },
              cate: { id: input.cateId },
            }),
          );
        });
      }

      return { success: true };
    } catch (e) {
      return {
        success: false,
        error: `${e}`,
      };
    }
  }
}
