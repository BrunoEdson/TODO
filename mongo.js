const {MongoClient} = require('mongodb')

async function main(mode, data = {}) {
    const uri ='mongodb://localhost:27017/'
    const client = new MongoClient(uri)
    try{
        await client.connect()
        switch(mode){
            case 'insert':
                await createData(client, data)
                break
            case 'select':
                const sel = await searchMultiData(client)
                return sel
            case 'delete':
                const del = await deleteData(client, data)
                return del
        }
    }catch (e){
        console.log(e)
    }finally {
        await client.close()
    }
}

async function createData(client, data){
   const result = await client.db('todoApp').collection('todoApp').insertOne(data)
   console.log(`novo registro inserido com o id: ${result.insertedId}`)
}

async function searchData(client, data){
    const result = await client.db('mydb').collection('mydb').findOne(data)

    if (result){
        console.log(`encontrou dados:\nnome: ${result.nome}, idade: ${result.idade}`)
    }else{
        console.log('found none')
    }
 }

async function searchMultiData(client, {MaximumNumberOfResults = Number.MAX_SAFE_INTEGER} = {}){
    const cursor = await client.db('todoApp').collection('todoApp').find()
    const results = await cursor.toArray()
    return results
}

async function updateData(client, n, liv){
    const result = await client.db('mydb').collection('mydb').updateOne({nome: n}, {$set:{livro: liv}})
    console.log(`existem: ${result.matchedCount} registros no sistema`)
 }
 
//atualiza o dado. se não houver o dado, cria
 async function upsertData(client, n, data){
    const result = await client.db('mydb').collection('mydb').updateOne({nome: n}, {$set:data}, {upsert: true})
    console.log(`existem: ${result.matchedCount} registros no sistema`)

    if(result.upsertedCount > 0){
        console.log(`o registro com id: ${result.upsertedId} foi atualizado no sistema`)
    }else{
        console.log(`o registro com id: ${result.upsertedId} foi criado no sistema`)
    }
 }

 async function updateMultiData(client){
    const result = await client.db('mydb').collection('mydb').updateMany({nacionalidade:{$exists: false}}, {$set:{nacionalidade: 'brasileira'} })
    console.log(`existem: ${result.matchedCount} registros no sistema`)
 }

 async function deleteData(client, data){
    //console.log(data)
    const result = await client.db('todoApp').collection('todoApp').deleteOne(data)
    console.log(`registro: ${result.deletedCount} deletado no sistema`)
 }

 async function deleteMultiData(client, idade){
    const result = await client.db('mydb').collection('mydb').deleteMany({idade: {$gte: idade}})
    console.log(`houveram ${result.deletedCount} registros deletados no sistema`)
 }

 module.exports = main