import { VERIFY_ANTIFRAUD_PORT, VerifyAntifraudPortInterface } from '@modules/antifraud/domain/ports';
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionDto } from '../dto';
import { AntifraudController } from './antifraud.controller';

describe('AntifraudController', () => {
  let controller: AntifraudController;
  let verifyAntifraudUseCase: VerifyAntifraudPortInterface;

  const mockVerifyAntifraudUseCase: VerifyAntifraudPortInterface = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AntifraudController],
      providers: [
        {
          provide: VERIFY_ANTIFRAUD_PORT,
          useValue: mockVerifyAntifraudUseCase,
        },
      ],
    }).compile();

    controller = module.get<AntifraudController>(AntifraudController);
    verifyAntifraudUseCase = module.get<VerifyAntifraudPortInterface>(VERIFY_ANTIFRAUD_PORT);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('handleTransactionCreated', () => {
    it('should call verifyAntifraudUseCase.execute with transactionDto', async () => {
      const transactionDto: TransactionDto = {
        id: 'tx123',
        value: 1000,
        transactionStatus: 1,
      };

      await controller.handleTransactionCreated(transactionDto);

      expect(verifyAntifraudUseCase.execute).toHaveBeenCalledWith(transactionDto);
    });
  });
});
