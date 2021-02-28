import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

class AnsewerController {
   async execute(request: Request, response: Response){
    const { value } = request.params;
    const { u } = request.query;

    const suveysUsresRespository = getCustomRepository(SurveysUsersRepository);

    const surveyUser = await suveysUsresRespository.findOne({
      id: String(u)
    });

    if(!surveyUser){
      throw new AppError("Survey users does not exist", 400);
    }

    surveyUser.value = Number(value);

    await suveysUsresRespository.save(surveyUser);

    return response.json(surveyUser);
 
   }
}

export { AnsewerController }