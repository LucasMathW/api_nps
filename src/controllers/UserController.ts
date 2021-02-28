import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRespository } from '../repositories/UsersRepository';
import * as yup from 'yup';
import { AppError } from '../errors/AppError';
class UserController { 
  
  async create(request: Request, response: Response){
    const { name, email } = request.body;

    const schema = yup.object().shape({
      name: yup.string().required("Nome é obrigatório"),
      email: yup.string().email().required("email incorreto")
    })

    // if(!(await schema.isValid(request.body)) ){
    //   return response.status(400).json({error: 'Validation Failed!'})
    // }

    try{
     await schema.validate(request.body, {abortEarly: false});
    }catch(err){
      throw new AppError(err);
    }

    console.log('response', request.body);
    
    const usersRepository = getCustomRepository(UsersRespository);

    let user = await usersRepository.findOne({ email });

    if(!user){

      user = await usersRepository.create({
        name,
        email,
      });

      await usersRepository.save(user);

      return response.status(201).json(user);
      
    }

    throw new AppError('User Aleary exists!!');

  }

}

export { UserController };