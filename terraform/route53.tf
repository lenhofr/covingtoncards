# The hosted zone created when the domain was registered in Route 53.
data "aws_route53_zone" "this" {
  name         = "${var.domain_name}."
  private_zone = false
}

# Apex (covingtoncards.com) -> GitHub Pages' fixed IPs.
resource "aws_route53_record" "apex_a" {
  zone_id = data.aws_route53_zone.this.zone_id
  name    = local.apex_domain
  type    = "A"
  ttl     = 3600
  records = local.github_pages_ipv4
}

resource "aws_route53_record" "apex_aaaa" {
  zone_id = data.aws_route53_zone.this.zone_id
  name    = local.apex_domain
  type    = "AAAA"
  ttl     = 3600
  records = local.github_pages_ipv6
}

# www.covingtoncards.com -> GitHub's own domain for this account.
resource "aws_route53_record" "www_cname" {
  zone_id = data.aws_route53_zone.this.zone_id
  name    = local.www_domain
  type    = "CNAME"
  ttl     = 3600
  records = [local.github_pages_cname]
}
