import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRespository } from '../repositories/UsersRepository';

class UserController { 
  
  async create(request: Request, response: Response){
    const { name, email } = request.body;

    console.log('response', request.body);
    
    const usersRepository = getCustomRepository(UsersRespository);

    let user = await usersRepository.findOne({ email })

    if(!user){

      user = await usersRepository.create({
        name,
        email,
      });

      await usersRepository.save(user);

      return response.status(201).json(user);
      
    }

    return response.status(400).json({ message: "Um usuário com este email já existe" });

  }

}

export { UserController };
