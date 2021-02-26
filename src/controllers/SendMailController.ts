import {Request, Response} from 'express'
import { getCustomRepository } from 'typeorm';
import { SurveyUser } from '../models/SurveyUser';
import { SurveysRepository } from '../repositories/SurveysRepository';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import { UsersRespository } from '../repositories/UsersRepository';

class SendMailController  {

  async execute(request: Request, response: Response){
    const {email, survey_id} = request.body;

    const usersRespository = getCustomRepository(UsersRespository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const userAlreadyExist = await usersRespository.findOne({email});

    if(!userAlreadyExist){
      return response.status(400).json({
        error: 'User does not exists'
      })
    }
  
    const surveyAlreadyExist = await surveysRepository.findOne({ id: survey_id });

    if(!surveyAlreadyExist){
      return response.status(400).json({
        error: 'Survey does not exists'
      })
    }

    //Salvar informações na tabela surveyUser
    const surveyUser = surveysUsersRepository.create({
      user_id: await userAlreadyExist.id,
      survey_id 
    })
    await surveysUsersRepository.save(surveyUser);
      
    return response.json(surveyUser);
  }
}
 
export {
  SendMailController
}