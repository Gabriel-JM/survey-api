import { mockCheckSurveyByIdRepository } from '@/data/_test'
import MockDate from 'mockdate'
import { DbCheckSurveyByIdUsecase } from './db-check-survey-by-id'

const fakeDate = new Date()

function makeSut () {
  const checkSurveyByIdRepositoryStub = mockCheckSurveyByIdRepository()

  const sut = new DbCheckSurveyByIdUsecase(checkSurveyByIdRepositoryStub)

  return {
    sut,
    checkSurveyByIdRepositoryStub
  }
}

describe('Db check survey by id use case', () => {
  beforeAll(() => MockDate.set(fakeDate))

  afterAll(() => MockDate.reset())

  it('should call CheckSurveyByIdRepository with correct values', async () => {
    const { sut, checkSurveyByIdRepositoryStub } = makeSut()
    await sut.checkById('any_id')

    expect(checkSurveyByIdRepositoryStub.checkById).toHaveBeenCalledWith('any_id')
  })

  it('should return false if CheckSurveyByIdRepository returns false', async () => {
    const { sut, checkSurveyByIdRepositoryStub } = makeSut()
    checkSurveyByIdRepositoryStub.checkById.mockResolvedValueOnce(false)

    const response = await sut.checkById('any_id')

    expect(response).toBe(false)
  })

  it('should return true on success', async () => {
    const { sut } = makeSut()
    const response = await sut.checkById('any_id')

    expect(response).toBe(true)
  })

  it('should throw if CheckSurveyByIdRepository throws', async () => {
    const { sut, checkSurveyByIdRepositoryStub } = makeSut()
    checkSurveyByIdRepositoryStub.checkById.mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.checkById('any_id')

    await expect(promise).rejects.toThrowError(Error)
  })
})
