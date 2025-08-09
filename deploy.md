# deploy production
zip -r deploy.zip . -x "node_modules/*" ".git/*" "*.zip" "tmp/*" ".DS_Store" ".next/*"

# create environment

eb terminate --force

eb create vml-d-ui-env --cname vml-d-ui --single

eb deploy --staged
# eb deploy