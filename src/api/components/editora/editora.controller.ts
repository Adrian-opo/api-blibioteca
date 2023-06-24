import { validate } from 'class-validator';
import { Response, Request } from "express";
import { AppDataSource } from '../../../config/database/mysql-datasource.config';
import { Editora } from "./editora.entity";

export class EditoraController{

    public async list(req:Request, res:Response){

        const  editora = await AppDataSource.manager.find(Editora);
        res.status(200).json({ dados: editora });
    }

    public async create(req: Request, res: Response){
        let editora = new Editora();
        editora.razao_social = req.body.razao_social;
        editora.nome_fantasia = req.body.nome_fantasia;
        editora.cnpj = req.body.cnpj;
        
        const erros = await validate(editora);

        if(erros.length > 0) {
            return res.status(400).json(erros);
        }

        const _editora = await AppDataSource.manager.save(editora);
        return res.status(201).json(_editora);
    }

    public async update( req: Request, res: Response){
        const {cod} = req.params;

        const editora = await AppDataSource.manager.findOneBy(Editora, {id: parseInt (cod)});

        if(editora == null ){
            return res.status(404).json({ erro: 'Editora não encontrada!'});
        }

        let {razao_social, nome_fantasia, cnpj} = req.body;
        
        editora.razao_social = razao_social;
        editora.nome_fantasia = nome_fantasia;
        editora.cnpj = cnpj;

        const editora_salva = await AppDataSource.manager.save(editora);

        return res.json(editora_salva);
    }

    public async destroy(req: Request, res: Response){

        const {cod} = req.params;

        const editora = await AppDataSource.manager.findOneBy(Editora, {id: parseInt (cod)});

        if(editora == null ){
            return res.status(404).json({ erro: 'Editora não encontrada!'});
        }

        await AppDataSource.manager.delete(Editora, editora);

        return res.status(204).json();

    }

    public async show(req: Request, res: Response){

        const {cod} = req.params;

        if(!Number.isInteger(parseInt(cod))) {
            return res.status(400).json();
        }

        const editora = await AppDataSource.manager.findOneBy(Editora, {id: parseInt (cod)});

        if(editora == null ){
            return res.status(404).json({ erro: 'Editora não encontrada!'});
        }

        return res.json(editora);

    }
}