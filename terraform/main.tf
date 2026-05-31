# Grupo de Recursos dedicado para el Minimarket
resource "azurerm_resource_group" "rg" {
  name     = "rg-${var.project_name}-${var.environment}-001"
  location = var.location
}

# Azure Cosmos DB (Modo Serverless)
resource "azurerm_cosmosdb_account" "cosmos" {
  name                = "cosmos-${var.project_name}-${var.environment}-001"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  offer_type          = "Standard"
  kind                = "GlobalDocumentDB"

  # Esta es la directiva que asegura que no haya cobro fijo por hora
  capabilities {
    name = "EnableServerless"
  }

  consistency_policy {
    consistency_level = "Session"
  }

  geo_location {
    location          = azurerm_resource_group.rg.location
    failover_priority = 0
  }
}

# Base de datos lógica dentro de Cosmos DB
resource "azurerm_cosmosdb_sql_database" "db" {
  name                = "MinimarketDB"
  resource_group_name = azurerm_resource_group.rg.name
  account_name        = azurerm_cosmosdb_account.cosmos.name
  # En modo Serverless NO se define "throughput", ya que es bajo demanda.
}

# Azure Static Web App (Capa Gratuita)
resource "azurerm_static_web_app" "swa" {
  name                = "aswa-${var.project_name}-${var.environment}-001"
  resource_group_name = azurerm_resource_group.rg.name
  location            = "eastus2" # SWA requiere regiones específicas, East US 2 es válida
  sku_tier            = "Free"
  sku_size            = "Free"
}