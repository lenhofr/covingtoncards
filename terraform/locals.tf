locals {
  apex_domain = var.domain_name
  www_domain  = "www.${var.domain_name}"

  # GitHub Pages doesn't support ALIAS/ANAME at the apex, so the apex gets plain
  # A/AAAA records at GitHub's fixed IPs instead of an alias to a CloudFront-style
  # target. Documented at https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site
  github_pages_ipv4 = [
    "185.199.108.153",
    "185.199.109.153",
    "185.199.110.153",
    "185.199.111.153",
  ]
  github_pages_ipv6 = [
    "2606:50c0:8000::153",
    "2606:50c0:8001::153",
    "2606:50c0:8002::153",
    "2606:50c0:8003::153",
  ]

  # www can ALIAS/CNAME to GitHub's own domain for the account.
  github_pages_cname = "${var.github_owner}.github.io."

  tags = {
    Project   = "covingtoncards"
    ManagedBy = "Terraform"
  }
}
