# 🏛️ DEDALUS: Dynamic Engine for Deployment and Automated Logic Utility System

**DEDALUS** é uma plataforma SaaS (Software as a Service) de Composição de Microsserviços Low-Code. Seu propósito central é capacitar arquitetos e engenheiros a projetar, orquestrar e implantar fluxos de trabalho de backend complexos de maneira visual e modular, eliminando a dependência da codificação manual de microsserviços e gateways.

## 🎯 Visão e Propósito

Construído sob o princípio da modularidade e governança de sistemas, DEDALUS visa ser o **motor lógico central** para a criação de soluções robustas de **Automação** e **IA-as-a-Service**, garantindo alta escalabilidade e coesão arquitetural.

## 🛠️ Pilha Tecnológica (Stack)

O projeto é estruturado em uma arquitetura de monorepo/múltiplos serviços com foco em performance e tipagem rigorosa:

| Componente | Tecnologia Principal | Justificativa |
| :--- | :--- | :--- |
| **Backend/Engine** | Node.js (TypeScript) | Alta performance em I/O assíncrono e tipagem estrita para segurança lógica. |
| **Frontend/Designer** | React (TypeScript) | Eficiência na construção de interfaces complexas de arrastar-e-soltar (Low-Code Designer). |
| **Orquestração** | FSM (Finite State Machines) / Workflow Engine | Gerenciamento de estado transacional e lógica de fluxo. |
| **Banco de Dados** | PostgreSQL (ou similar) | Robustez e confiabilidade para persistência de metadados e logs de execução. |

## 📦 Estrutura Modular do Repositório

O projeto DEDALUS adota uma estrutura de diretórios que espelha sua arquitetura modular, facilitando a separação de responsabilidades e a escalabilidade:


/DEDALUS/
├── /backend/
│   ├── /orchestration-engine/  # Núcleo de interpretação de fluxo e execução lógica
│   ├── /api-gateway/          # Ponto de acesso unificado para microsserviços compostos
│   └── /database/             # Migrações e scripts de esquema
├── /frontend/
│   ├── /designer-ui/          # Componentes visuais do Low-Code Designer
│   └── /catalog-ui/           # Interface do Catálogo de Módulos
├── /modules/
│   └── /connectors/           # APIs de terceiros e Módulos de IA reutilizáveis
├── /infra/                    # Configurações de Deploy (Dockerfiles, Kubernetes/Serverless)
├── README.md                  # Este arquivo
└── package.json               # Gerenciamento de dependências

## ⚙️ Configuração e Desenvolvimento Local

**Pré-requisitos:**

* Node.js (versão LTS recomendada)
* npm ou yarn
* Git
* VS Code (ambiente de desenvolvimento recomendado)

**Instalação Inicial:**

1.  Clone o repositório: `git clone https://dedalus.usp.br/`
2.  Navegue até a pasta: `cd DEDALUS`
3.  Instale as dependências (será necessário configurar um monorepo ou instalar dependências por pasta): `npm install` (ou `yarn install`)

## 🛣️ Próximos Passos (Roadmap Inicial)

1.  Implementação da estrutura de projeto Node.js/TypeScript no `/backend/orchestration-engine/`.
2.  Definição do contrato (schema) de dados básico para o *workflow* visual (JSON/YAML).
3.  Desenvolvimento do primeiro módulo de utilidade no `/modules/connectors/`.

---

**Próxima Ação:** Após a criação e *commit* deste `README.md` no seu repositório GitHub, sugiro avançarmos para a **Estrutura de Código no *Backend***, focando na inicialização do projeto Node.js/TypeScript em `/backend/orchestration-engine/`.

**Vamos estruturar o *backend* do Motor de Orquestração do DEDALUS?**

