import {Request, Response} from 'express'
import { getCustomRepository } from 'typeorm';
import { SurveysRepository } from '../repositories/SurveysRepository';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import { UsersRespository } from '../repositories/UsersRepository';
import sendMailService from '../services/sendMailService';
import { resolve } from 'path'

class SendMailController  {

  async execute(request: Request, response: Response){
    const {email, survey_id} = request.body;

    const usersRespository = getCustomRepository(UsersRespository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const user = await usersRespository.findOne({ email });

    if(!user){
      return response.status(400).json({
        error: 'User does not exists'
      })
    }
  
    const survey = await surveysRepository.findOne({ id: survey_id });

    if(!survey){
      return response.status(400).json({
        error: 'Survey does not exists'
      })
    }
    
    const npsPath = resolve(__dirname, "..", "views", "emails", "npsmail.hbs");
    
    const surveyUsersAlreadyExists = await surveysUsersRepository.findOne({
      where: { user_id: user.id, value: null },
      relations: ['user', 'survey'],
    });
    
    const variables = {
      name: user.name,
      titile: survey.title,
      description: survey.description,
      id: "",
      link: process.env.URL_MAIL
    };

    if (surveyUsersAlreadyExists){
      variables.id = surveyUsersAlreadyExists.id,
      await sendMailService.execute(email, survey.title, variables,  npsPath); 
      return response.json(surveyUsersAlreadyExists);
    }

    //Salvar informações na tabela surveyUser
    const surveyUser = await surveysUsersRepository.create({
      user_id: user.id,
      survey_id   
    });
    
    await surveysUsersRepository.save(surveyUser);

    variables.id = surveyUser.id

    await sendMailService.execute(email, survey.title, variables, npsPath); 

    return response.json( surveyUser );
  }
}
 
export {
  SendMailController
}