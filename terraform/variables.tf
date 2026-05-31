variable "location" {
  description = "Región principal para los recursos"
  type        = string
  default     = "eastus2"
}

variable "project_name" {
  description = "Nombre base del proyecto"
  type        = string
  default     = "minimarket"
}

variable "environment" {
  description = "Entorno de despliegue"
  type        = string
  default     = "prd"
}