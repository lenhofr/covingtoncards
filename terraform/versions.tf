terraform {
  required_version = ">= 1.12.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Remote state in the shared S3 bucket used by the other static sites.
  backend "s3" {
    bucket       = "tf-state-common-217354297026-us-east-1"
    key          = "covingtoncards/terraform.tfstate"
    region       = "us-east-1"
    encrypt      = true
    use_lockfile = true # S3-native state locking (Terraform >= 1.10); no DynamoDB needed
  }
}
