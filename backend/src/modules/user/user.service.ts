import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { CreateAccountDto } from './dtos/createAccount.dto';
import * as bcrypt from 'bcrypt';
import { CoreOutput } from '../../common/dtos/coreOutput.dto';
import * as Validator from 'class-validator';
import { UpdateAccountDto } from './dtos/updateAccount.dto';
import { ResetGptDailyLimitInputDto, ResetGptDailyLimitOutputDto } from './dtos/gptManagement.dto';

/** 실질적인 서비스 구현 */
@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async createAccount(input: CreateAccountDto): Promise<CoreOutput> {
    try {
      //중복 검증
      const exists = await this.userRepository.findOne({
        where: { email: input.email },
      });

      if (exists) {
        return {
          success: false,
          target: 'email',
          error: `이미 등록된 이메일입니다.`,
        };
      }

      /** 계정생성 */
      await this.userRepository.save(
        await this.userRepository.create({
          email: input.email,
          password: await bcrypt.hash(input.password, 10),
          name: input.name,
          mobile: input.mobile,
          gptDailyLimit: 10,
          gptDailyResetDate: input.gptDailyResetDate,
        }),
      );

      return { success: true };
    } catch (e) {
      return { success: false, error: `${e}` };
    }
  }

  /** 로그인 검증 */
  async validate(email: string, password: string): Promise<User | null> {
    try {
      let user: User = null;
      //이메일 유효성 검사
      if (Validator.isEmail(email) && email.length >= 6) {
        user = await this.userRepository
          .createQueryBuilder() //이 후에 SQL쿼리언어처럼 DB에서 데이터조회 가능
          .select('*') //쿼리빌더 이후로 지정해준 쿼리같은 메소드
          .where('email = :email', { email: email }) //조회조건
          .getRawOne(); //Raw통째로 가져온다. 유효성이 검증되면 user를 반환하고, user = 해당유저의 데이터이다.(email,password,id,token 등등)
      }

      if (user && bcrypt.compareSync(password, user.password)) {
        return user;
      }
    } catch (e) {
      this.logger.error(e);
    }
    return null;
  }

  /** gpt daily limit 리셋 */
  async resetGptDailyLimit(
    input: ResetGptDailyLimitInputDto,
    user: User,
  ): Promise<ResetGptDailyLimitOutputDto> {
    try {
      if (input.gptDailyResetDate === user.gptDailyResetDate) {
        return {
          success: true,
          gptDailyResetDate: user.gptDailyResetDate,
          gptDailyLimit: user.gptDailyLimit,
          message: '자정이 지나면 리필됩니다.',
        };
      }

      user.gptDailyResetDate = input.gptDailyResetDate;
      user.gptDailyLimit = 10;

      await this.userRepository.save(user);

      return {
        success: true,
        gptDailyResetDate: user.gptDailyResetDate,
        gptDailyLimit: 10,
      };
    } catch (error) {
      return { success: false, error: `gpt 통신 실패, error: ${error}` };
    }
  }

  /** 모든유저정보 */
  async getAll(): Promise<User[]> {
    return this.userRepository.find();
  }
  /** id 검색 */
  async findById(id: number): Promise<User> {
    return await this.userRepository.findOneByOrFail({ id });
  }
  /** 프로필 response */
  async profile(id: number): Promise<User> {
    return await this.userRepository.findOneBy({ id });
  }
  /** id 삭제 */
  async delete(userId: number): Promise<CoreOutput> {
    const result = await this.userRepository.delete(userId);
    if (result.affected === 0) {
      return { success: false, error: '해당 아이디는 존재하지 않습니다.' };
    } else {
      return { success: true };
    }
  }
  /** id 업데이트 */
  async update(userId: number, updateData: object): Promise<CoreOutput> {
    try {
      await this.userRepository.update(userId, updateData);
      return {
        success: true,
      };
    } catch (error) {
      return { success: false, error: '유저 데이터 업데이트 실패' };
    }
  }

  /** 유저 데이터 저장 */
  async saveUser(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  /** 프로필 업데이트 */
  async profileUpdate(
    user: User,
    updateData: UpdateAccountDto,
  ): Promise<CoreOutput> {
    try {
      const thisEmail = user.email;
      const emailExists = await this.userRepository.findOne({
        where: [{ email: updateData.email }],
      });
      const mobileExists = await this.userRepository.findOne({
        where: [{ mobile: updateData.mobile }],
      });

      if (thisEmail != updateData.email && emailExists) {
        return {
          success: false,
          error: '중복된 이메일입니다.',
          target: 'email',
        };
      }
      if (thisEmail != updateData.email && mobileExists) {
        return { success: false, error: '중복된 휴대폰입니다.' };
      }

      const userData = {
        email: updateData.email,
        name: updateData.name,
        mobile: updateData.mobile,
      };

      if (updateData.password === '') {
        await this.userRepository.update(user.id, userData);
        return { success: true };
      } else {
        await this.userRepository.update(user.id, {
          ...userData,
          password: await bcrypt.hash(updateData.password, 10),
        });
        return { success: true };
      }
    } catch (e) {
      return { success: false, error: '유저 데이터 업데이트 실패' };
    }
  }
}
