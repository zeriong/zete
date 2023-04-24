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
  UpdateOneCateInputDto,
} from './dtos/cate.dto';
import { SendContentDataOutputDto } from './dtos/sendContentData.dto';
import { raw } from 'express';

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
      const cate = await this.categoriesRepository
        .createQueryBuilder('categories')
        .where('categories.userId = :userId', { userId: user.id })
        .getMany();

      const tags = await this.tagsRepository
        .createQueryBuilder('tags')
        .where('categories.userId = :userId', { userId: user.id })
        .getMany();

      const memos = await this.memoRepository
        .createQueryBuilder('memos')
        .where('categories.userId = :userId', { userId: user.id })
        .getMany();

      return { success: true, cate, tags, memos };
    } catch (e) {
      return { success: false, error: '데이터를 받아오지 못했습니다.' };
    }
  }

  async createCate(
    input: CreateCateDto,
    user: User,
  ): Promise<CreateCateOutputDto> {
    try {
      if (input.cateName === '') return { success: false };

      //중복 검증
      const exists = await this.categoriesRepository.findOne({
        where: [{ cateName: input.cateName }],
      });

      if (exists) {
        return {
          success: false,
          target: 'cate',
          error: `중복된 카테고리입니다.`,
        };
      }

      await this.categoriesRepository.save(
        this.categoriesRepository.create({ cateName: input.cateName, user }),
      );

      const cate = await this.categoriesRepository
        .createQueryBuilder('categories') //이 후에 SQL쿼리언어처럼 DB에서 데이터조회 가능
        .where('categories.userId = :userId', { userId: user.id }) //조회조건
        .getMany(); //해당 조건 모든데이터 반환

      return { success: true, cate };
    } catch (e) {
      return { success: false, error: e };
    }
  }

  async updateOneCate(input: UpdateOneCateInputDto): Promise<CoreOutput> {
    try {
      // 프론트에서도 빈문자열 필터링++
      if (input.cateName === '') {
        return { success: true, message: '공백은 추가할 수 없습니다.' };
      }
      // where조건엔 맞지만 andWhere조건이 맞지않는경우 false값 반환
      const nonChange = await this.categoriesRepository
        .createQueryBuilder('categories')
        .where('categories.id = :cateId', { cateId: input.cateId })
        .andWhere('categories.cateName = :cateName', {
          cateName: input.cateName,
        });

      if (nonChange) {
        return {
          success: true,
          message: '변경사항 없음',
        };
      }

      await this.categoriesRepository.update(input.cateId, {
        cateName: input.cateName,
      });

      return { success: true, message: 'cate 업데이트완료' };
    } catch (e) {
      return { success: false, error: e };
    }
  }

  async updateManyCate(input: UpdateManyCateInputDto): Promise<CoreOutput> {
    try {
      console.log(input);
      console.log('스탭1');
      // 프론트에서도 빈문자열 필터링++
      // const empty = input.cate.filter((cate) => cate.cateName === '');
      console.log('스탭2');
      // if (empty.length !== 0) {
      //   return {
      //     success: false,
      //     error: '카테고리에 빈문자열은 추가할 수 없습니다.',
      //   };
      // }
      //
      // input[0].map(async (cate) => {
      //   const exist = await this.categoriesRepository
      //     .createQueryBuilder('categories')
      //     .where('categories.id = :cateId', { cateId: cate.cateId })
      //     .andWhere('categories.cateName = :cateName', {
      //       cateName: cate.cateName,
      //     });
      //
      //   if (exist) return;
      //
      //   return this.categoriesRepository.update(cate.cateId, {
      //     cateName: cate.cateName,
      //   });
      // });

      return { success: true, message: 'cate 업데이트완료' };
    } catch (e) {
      return { success: false, error: `${e}` };
    }
  }

  async createMemo(input: CreateMemoInputDto, user: User): Promise<CoreOutput> {
    try {
      await this.memoRepository.save(
        this.memoRepository.create({
          title: input.title,
          content: input.content,
          important: input.important,
          cate: { id: 1 },
          user,
        }),
      );

      if (input.tags.length !== 0) {
        await Promise.all(
          input.tags.map((tag) => {
            this.tagsRepository.save(
              this.tagsRepository.create({ tagName: tag, user }),
            );
          }),
        );
      }
      return { success: true };
    } catch (e) {
      return {
        success: false,
        error: e,
      };
    }
  }
}
