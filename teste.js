var db = require('./schema');

db.estado.collection.insert([
    {sigla: 'AC', nome_estado: 'Acre'},
    {sigla: 'AL', nome_estado: 'Alagoas'},
    {sigla: 'AM', nome_estado: 'Amazonas'},
    {sigla: 'AP', nome_estado: 'Amapá'},
    {sigla: 'BA', nome_estado: 'Bahia'},
    {sigla: 'CE', nome_estado: 'Ceará'},
    {sigla: 'DF', nome_estado: 'Distrito Federal'},
    {sigla: 'ES', nome_estado: 'Espírito Santo'},
    {sigla: 'GO', nome_estado: 'Goiás'},
    {sigla: 'MA', nome_estado: 'Maranhão'},
    {sigla: 'MG', nome_estado: 'Minas Gerais'},
    {sigla: 'MS', nome_estado: 'Mato Grosso do Sul'},
    {sigla: 'MT', nome_estado: 'Mato Grosso'},
    {sigla: 'PA', nome_estado: 'Pará'},
    {sigla: 'PB', nome_estado: 'Paraíba'},
    {sigla: 'PE', nome_estado: 'Pernambuco'},
    {sigla: 'PI', nome_estado: 'Piauí'},
    {sigla: 'PR', nome_estado: 'Paraná'},
    {sigla: 'RJ', nome_estado: 'Rio de Janeiro'},
    {sigla: 'RN', nome_estado: 'Rio Grande do Norte'},
    {sigla: 'RO', nome_estado: 'Rondônia'},
    {sigla: 'RR', nome_estado: 'Roraima'},
    {sigla: 'RS', nome_estado: 'Rio Grande do Sul'},
    {sigla: 'SC', nome_estado: 'Santa Catarina'},
    {sigla: 'SE', nome_estado: 'Sergipe'},
    {sigla: 'SP', nome_estado: 'São Paulo'},
    {sigla: 'TO', nome_estado: 'Tocantins'}
], {
    writeConcern: {w: 0},
    ordered: false
});

