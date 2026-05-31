terraform {
  required_version = ">= 1.0.0"
  
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.90" # Usamos una versión estable reciente
    }
  }

  backend "azurerm" {
    resource_group_name  = "rg-infra-central-prd"
    storage_account_name = "sttfstatecentralprd001"
    container_name       = "tfstates"
    key                  = "minimarket-creditos.tfstate" # Llave única de este proyecto
  }
}

provider "azurerm" {
  features {}
}