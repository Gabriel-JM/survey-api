import { mockLoadSurveyByIdRepository } from '@/data/_test'
import { mockSurveyModel } from '@/domain/_test'
import MockDate from 'mockdate'
import { DbLoadSurveyByIdUsecase } from './db-load-survey-by-id'

const fakeDate = new Date()

const fakeSurvey = mockSurveyModel(fakeDate)

function makeSut () {
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository(fakeDate)

  const sut = new DbLoadSurveyByIdUsecase(loadSurveyByIdRepositoryStub)

  return {
    sut,
    loadSurveyByIdRepositoryStub
  }
}

describe('Db load survey by id use case', () => {
  beforeAll(() => MockDate.set(fakeDate))

  afterAll(() => MockDate.reset())

  it('should call LoadSurveyByIdRepository with correct values', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    await sut.loadById('any_id')

    expect(loadSurveyByIdRepositoryStub.loadById).toHaveBeenCalledWith('any_id')
  })

  it('should return null if LoadSurveyByIdRepository returns null', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    loadSurveyByIdRepositoryStub.loadById.mockResolvedValueOnce(null)

    const response = await sut.loadById('any_id')

    expect(response).toBeNull()
  })

  it('should return a survey on success', async () => {
    const { sut } = makeSut()
    const response = await sut.loadById('any_id')

    expect(response).toEqual(fakeSurvey)
  })

  it('should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    loadSurveyByIdRepositoryStub.loadById.mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.loadById('any_id')

    await expect(promise).rejects.toThrowError(Error)
  })
})
