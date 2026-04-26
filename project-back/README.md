# Habita40 Backend - Spring Boot

## Estrutura do Projeto

```
project-back/
├── pom.xml
├── src/
│   └── main/
│       ├── java/
│       │   └── com/habita40/project/
│       │       ├── Habita40Application.java
│       │       ├── config/GlobalExceptionHandler.java
│       │       ├── controller/PlantaController.java
│       │       ├── dto/
│       │       │   ├── ComodoDTO.java
│       │       │   ├── PlantaRequestDTO.java
│       │       │   ├── PlantaResponseDTO.java
│       │       │   └── ValidacaoResultDTO.java
│       │       ├── entity/
│       │       │   ├── ComodoEntity.java
│       │       │   └── PlantaEntity.java
│       │       ├── repository/PlantaRepository.java
│       │       └── service/
│       │           ├── PdfGenerationService.java
│       │           └── PlantaService.java
│       └── resources/
│           └── application.yml
```

## Pré-requisitos

- Java 17+
- Maven 3.8+

## Compilação e Execução

```bash
# No diretório project-back/
mvn clean install
mvn spring-boot:run
```

## Endpoints REST

| Método | Endpoint | Descrição |
|--------|-----------|-----------|
| POST | /api/plantas | Criar nova planta |
| POST | /api/plantas/validar | Validar planta HIS |
| POST | /api/plantas/gerar-automatica | Gerar planta com disposição automática |
| GET | /api/plantas | Listar todas as plantas |
| GET | /api/plantas/{id} | Buscar planta por ID |
| GET | /api/plantas/{id}/pdf | Baixar PDF da planta |
| GET | /api/plantas/modelos-basicos | Listar modelos básicos HIS |

## Requisitos HIS

- Área máxima total: 50m²
- Dimensões mínimas: 500cm x 500cm
- Cômodos obrigatórios:
  - Sala/Estar
  - Cozinha
  - Dormitório(s)
  - Banheiro(s)
- Largura/comprimento por cômodo: 200cm - 1000cm

## Exemplos de Requisição

### Criar planta com cômodos:
```json
{
  "nome": "Minha Casa HIS",
  "larguraTotal": 600.0,
  "comprimentoTotal": 700.0,
  "anoConstrucao": 2026,
  "comodos": [
    {"nome": "Sala/Estar", "largura": 300.0, "comprimento": 350.0},
    {"nome": "Cozinha", "largura": 200.0, "comprimento": 250.0},
    {"nome": "Dormitório 1", "largura": 280.0, "comprimento": 300.0},
    {"nome": "Dormitório 2", "largura": 280.0, "comprimento": 280.0},
    {"nome": "Banheiro", "largura": 200.0, "comprimento": 150.0}
  ]
}
```

### Validar planta:
```bash
curl -X POST http://localhost:8080/api/plantas/validar \
  -H "Content-Type: application/json" \
  -d @request.json
```

### Baixar PDF:
```bash
curl -o planta.pdf http://localhost:8080/api/plantas/1/pdf
```

## Tecnologias

- Spring Boot 3.2.2
- Spring Data JPA
- H2 Database (in-memory)
- Apache PDFBox 3.0.1 (geração PDF)
- Lombok

## Porta

O servidor inicia na porta 8080 por padrão.