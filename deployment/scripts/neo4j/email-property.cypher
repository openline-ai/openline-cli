match (u:User)--(e:Email{rawEmail:"jonty@openline.ai"}) set e.email = 'jonty@openline.ai';
match (u:User)--(e:Email{rawEmail:"matt@openline.ai"}) set e.email = 'matt@openline.ai';
match (u:User)--(e:Email{rawEmail:"antoine@openline.ai"}) set e.email = 'antoine@openline.ai';
match (u:User)--(e:Email{rawEmail:"edi@openline.ai"}) set e.email = 'edi@openline.ai';
match (u:User)--(e:Email{rawEmail:"vasi@openline.ai"}) set e.email = 'vasi@openline.ai';

MATCH (t:Tenant {name:"openlineai"})
MERGE (e:ExternalSystem {id:"slack", name: "slack"})-[:EXTERNAL_SYSTEM_BELONGS_TO_TENANT]->(t);
MATCH (t:Tenant {name:"openlineai"})
MERGE (e:ExternalSystem {id:"intercom", name: "intercom"})-[:EXTERNAL_SYSTEM_BELONGS_TO_TENANT]->(t);

:exit;
