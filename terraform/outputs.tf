output "site_url" {
  description = "Canonical site URL."
  value       = "https://${local.apex_domain}"
}

output "route53_name_servers" {
  description = "Name servers for the hosted zone (should match the domain registration)."
  value       = data.aws_route53_zone.this.name_servers
}

output "github_pages_cname_target" {
  description = "CNAME target www.covingtoncards.com points at."
  value       = local.github_pages_cname
}
