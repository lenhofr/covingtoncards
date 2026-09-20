variable "domain_name" {
  description = "Apex domain for the site (the Route 53 hosted zone must already exist)."
  type        = string
  default     = "covingtoncards.com"
}

variable "aws_region" {
  description = "AWS region for the Route 53 provider calls (Route 53 itself is global)."
  type        = string
  default     = "us-east-1"
}

variable "github_owner" {
  description = "GitHub user/org that owns the Pages site (used to build the www CNAME target)."
  type        = string
  default     = "lenhofr"
}
