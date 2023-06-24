import { validate } from 'class-validator';
import { Response, Request } from "express";
import { AppDataSource } from '../../../config/database/mysql-datasource.config';
import { Autor } from '../autor/autor.entity';
import { Editora } from '../editora/editora.entity';
import { Livro } from "./livro.entity";

export class LivroController{

    public async list(req:Request, res:Response){

        const  livro = await AppDataSource.manager.find(Livro);
        res.status(200).json({ dados: livro });
    }

    public async create(req: Request, res: Response){
        const _autor = await AppDataSource.manager.findOneBy(Autor, { id: req.body.autor_id });
        if(req.body.sinopse == undefined || _autor == null){
            return res.status(404).json({ erro: 'Autor inexistente'})
        }

        const _editora = await AppDataSource.manager.findOneBy(Editora, { id: req.body.editora_id });
        if(req.body.editora_id == undefined || _editora == null){
            return res.status(404).json({ erro: 'Editora inexistente'})
        }

        let livro = new Livro();
        livro.sinopse = req.body.sinopse;
        livro.isbn = req.body.isbn;
        livro.titulo = req.body.titulo;
        livro.quantidade_exemplares = req.body.quantidade_exemplares;
        livro.ano_publicacao = req.body.ano_publicacao;
        livro.exemplares_disponivel = req.body.exemplares_disponivel;
        livro.autor_id = req.body.autor_id;
        livro.editora_id = req.body.editora_id;

        const erros = await validate(livro);

        if(erros.length > 0) {
            return res.status(400).json(erros);
        }

        const _livro = await AppDataSource.manager.save(livro);

        return res.status(201).json(_livro);
    }

    public async update( req: Request, res: Response){
        const {cod} = req.params;

        const livro = await AppDataSource.manager.findOneBy(Livro, {id: parseInt (cod)});

        if(livro == null ){
            return res.status(404).json({ erro: 'Livro não encontrado!'});
        }

        let {sinopse, isbn, titulo, quantidade_exemplares, ano_publicacao, exemplares_desponivel, autor_id, editora_id} = req.body;

        livro.sinopse = sinopse;
        livro.isbn = isbn;
        livro.titulo = titulo;
        livro.quantidade_exemplares = quantidade_exemplares;
        livro.ano_publicacao = ano_publicacao;
        livro.exemplares_disponivel = exemplares_desponivel;
        livro.autor_id = autor_id;
        livro.editora_id = editora_id;

        const livro_salvo = await AppDataSource.manager.save(livro);

        return res.json(livro_salvo);
    }

    public async destroy(req: Request, res: Response){

        const {cod} = req.params;

        const livro = await AppDataSource.manager.findOneBy(Livro, {id: parseInt (cod)});

        if(livro == null ){
            return res.status(404).json({ erro: 'Livro não encontrado!'});
        }

        await AppDataSource.manager.delete(Livro, livro);

        return res.status(204).json();

    }

    public async show(req: Request, res: Response){

        const {cod} = req.params;

        if(!Number.isInteger(parseInt(cod))) {
            return res.status(400).json();
        }

        const livro = await AppDataSource.manager.findOneBy(Livro, {id: parseInt (cod)});

        if(livro == null ){
            return res.status(404).json({ erro: 'Livro não encontrado!'});
        }

        return res.json(livro);

    }
}