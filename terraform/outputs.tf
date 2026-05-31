output "resource_group_name" {
  value = azurerm_resource_group.rg.name
}

output "cosmosdb_endpoint" {
  value = azurerm_cosmosdb_account.cosmos.endpoint
}

output "cosmosdb_primary_key" {
  value     = azurerm_cosmosdb_account.cosmos.primary_key
  sensitive = true
}

output "static_web_app_url" {
  value = azurerm_static_web_app.swa.default_host_name
}