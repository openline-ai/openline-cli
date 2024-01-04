MERGE(t:Tenant {name: "openlineai"}) ON CREATE SET t.createdAt=datetime({timezone: 'UTC'}), t.id=randomUUID();
MATCH (t:Tenant {name:"openlineai"})
MERGE (t)-[:HAS_WORKSPACE]->(w:Workspace {name:"openline.ai", provider: "google", appSource: "manual"});

MATCH (t:Tenant {name:"openlineai"})
MERGE (u:User {id:"development@openline.ai"})-[:USER_BELONGS_TO_TENANT]->(t)
ON CREATE SET
    u.firstName="Development",
    u.lastName="User",
    u.createdAt=datetime({timezone: 'UTC'}),
    u.source="openline",
    u.sourceOfTruth="openline",
    u.appSource="manual";

MATCH (t:Tenant {name:"openlineai"})
MERGE (t)<-[:EMAIL_ADDRESS_BELONGS_TO_TENANT]-(e:Email {rawEmail:"development@openline.ai"})
ON CREATE SET
            e.email='development@openline.ai',
            e.id=randomUUID(),
            e.source="openline",
            e.sourceOfTruth="openline",
            e.appSource="manual",
            e.createdAt=datetime({timezone: 'UTC'}),
            e.updatedAt=datetime({timezone: 'UTC'})
WITH t, e
MATCH (u:User {id:"development@openline.ai"})-[:USER_BELONGS_TO_TENANT]->(t)
MERGE (u)-[rel:HAS]->(e)
ON CREATE SET
            rel.primary=true,
            rel.label="WORK";

MATCH (t:Tenant {name:"openlineai"})
MERGE (t)<-[:EMAIL_ADDRESS_BELONGS_TO_TENANT]-(e:Email {rawEmail:"edi@openline.ai"})
ON CREATE SET
            e.email="edi@openline.ai",
            e.id=randomUUID(),
            e.source="openline",
            e.sourceOfTruth="openline",
            e.appSource="manual",
            e.createdAt=datetime({timezone: 'UTC'}),
            e.updatedAt=datetime({timezone: 'UTC'})
WITH t, e
MERGE (t)<-[:USER_BELONGS_TO_TENANT]-(u:User)-[rel:HAS]->(e)
ON CREATE SET
            u.id=randomUUID(),
            u.firstName="Eduard",
            u.lastName="Firut",
            u.roles=["USER", "OWNER"],
    		u.createdAt=datetime({timezone: 'UTC'}),
    		u.updatedAt=datetime({timezone: 'UTC'}),
    		u.source="openline",
    		u.sourceOfTruth="openline",
    		u.appSource="manual",
            rel.primary=true,
            rel.label="WORK"
MERGE (p:Player {authId: "edi@openline.ai", provider: "google"})-[:IDENTIFIES {default: true}]->(u)
ON CREATE SET
        p.id=randomUUID(),
        p.createdAt=datetime({timezone: 'UTC'}),
        p.updatedAt=datetime({timezone: 'UTC'}),
        p.source="openline",
        p.sourceOfTruth="openline",
        p.appSource="manual";

MATCH (t:Tenant {name:"openlineai"})
MERGE (t)<-[:EMAIL_ADDRESS_BELONGS_TO_TENANT]-(e:Email {rawEmail:"alex@openline.ai"})
ON CREATE SET
            e.email="alex@openline.ai",
            e.id=randomUUID(),
            e.source="openline",
            e.sourceOfTruth="openline",
            e.appSource="manual",
            e.createdAt=datetime({timezone: 'UTC'}),
            e.updatedAt=datetime({timezone: 'UTC'})
WITH t, e
MERGE (t)<-[:USER_BELONGS_TO_TENANT]-(u:User)-[rel:HAS]->(e)
ON CREATE SET
            rel.primary=true,
            rel.label="WORK",
            u.id=randomUUID(),
            u.firstName="Alex",
            u.lastName="Basarab",
            u.roles=["USER", "OWNER"],
            u.createdAt=datetime({timezone: 'UTC'}),
            u.updatedAt=datetime({timezone: 'UTC'}),
            u.source="openline",
            u.sourceOfTruth="openline",
            u.appSource="manual"
MERGE (p:Player {authId: "alex@openline.ai", provider: "google"})-[:IDENTIFIES {default: true}]->(u)
ON CREATE SET
        p.id=randomUUID(),
        p.createdAt=datetime({timezone: 'UTC'}),
        p.updatedAt=datetime({timezone: 'UTC'}),
        p.source="openline",
        p.sourceOfTruth="openline",
        p.appSource="manual";

MATCH (t:Tenant {name:"openlineai"})
MERGE (t)<-[:EMAIL_ADDRESS_BELONGS_TO_TENANT]-(e:Email {rawEmail:"acalinica@openline.ai"})
ON CREATE SET
            e.email="acalinica@openline.ai",
            e.id=randomUUID(),
            e.source="openline",
            e.sourceOfTruth="openline",
            e.appSource="manual",
            e.createdAt=datetime({timezone: 'UTC'}),
            e.updatedAt=datetime({timezone: 'UTC'})
WITH t, e
MERGE (t)<-[:USER_BELONGS_TO_TENANT]-(u:User)-[rel:HAS]->(e)
ON CREATE SET
            rel.primary=true,
            rel.label="WORK",
            u.id=randomUUID(),
            u.firstName="Alex",
            u.lastName="Calinica",
            u.roles=["USER","OWNER"],
    		u.createdAt=datetime({timezone: 'UTC'}),
    		u.updatedAt=datetime({timezone: 'UTC'}),
    		u.source="openline",
    		u.sourceOfTruth="openline",
    		u.appSource="manual"
MERGE (p:Player {authId: "acalinica@openline.ai", provider: "google"})-[:IDENTIFIES {default: true}]->(u)
ON CREATE SET
        p.id=randomUUID(),
        p.identityId="31237453-f836-4899-a2ed-fe6ed713327d",
        p.createdAt=datetime({timezone: 'UTC'}),
        p.updatedAt=datetime({timezone: 'UTC'}),
        p.source="openline",
        p.sourceOfTruth="openline",
        p.appSource="manual";

MATCH (t:Tenant {name:"openlineai"})
MERGE (t)<-[:EMAIL_ADDRESS_BELONGS_TO_TENANT]-(e:Email {rawEmail:"silviu@openline.ai"})
ON CREATE SET
            e.email="silviu@openline.ai",
            e.id=randomUUID(),
            e.source="openline",
            e.sourceOfTruth="openline",
            e.appSource="manual",
            e.createdAt=datetime({timezone: 'UTC'}),
            e.updatedAt=datetime({timezone: 'UTC'})
WITH t, e
MERGE (t)<-[:USER_BELONGS_TO_TENANT]-(u:User)-[rel:HAS]->(e)
ON CREATE SET
            rel.primary=true,
            rel.label="WORK",
            u.id=randomUUID(),
            u.firstName="Silviu",
            u.lastName="Basu",
            u.roles=["USER","OWNER"],
    		u.createdAt=datetime({timezone: 'UTC'}),
    		u.updatedAt=datetime({timezone: 'UTC'}),
    		u.source="openline",
    		u.sourceOfTruth="openline",
    		u.appSource="manual"
MERGE (p:Player {authId: "silviu@openline.ai", provider: "google"})-[:IDENTIFIES {default: true}]->(u)
ON CREATE SET
        p.id=randomUUID(),
        p.identityId="1edadb89-7ce1-41d0-a2d3-e673795b90b6",
        p.createdAt=datetime({timezone: 'UTC'}),
        p.updatedAt=datetime({timezone: 'UTC'}),
        p.source="openline",
        p.sourceOfTruth="openline",
        p.appSource="manual";


MATCH (t:Tenant {name:"openlineai"})
MERGE (t)<-[:EMAIL_ADDRESS_BELONGS_TO_TENANT]-(e:Email {rawEmail:"kasia@openline.ai"})
ON CREATE SET
            e.email="kasia@openline.ai",
            e.id=randomUUID(),
            e.source="openline",
            e.sourceOfTruth="openline",
            e.appSource="manual",
            e.createdAt=datetime({timezone: 'UTC'}),
            e.updatedAt=datetime({timezone: 'UTC'})
WITH t, e
MERGE (t)<-[:USER_BELONGS_TO_TENANT]-(u:User)-[rel:HAS]->(e)
ON CREATE SET
            rel.primary=true,
            rel.label="WORK",
            u.id=randomUUID(),
            u.firstName="Kasia",
            u.lastName="Marciniszyn",
            u.roles=["USER","OWNER"],
    		u.createdAt=datetime({timezone: 'UTC'}),
    		u.updatedAt=datetime({timezone: 'UTC'}),
    		u.source="openline",
    		u.sourceOfTruth="openline",
    		u.appSource="manual"
MERGE (p:Player {authId: "kasia@openline.ai", provider: "google"})-[:IDENTIFIES {default: true}]->(u)
ON CREATE SET
        p.id=randomUUID(),
        p.identityId="b7aeff67-ca86-4f68-8344-37748ae792fe",
        p.createdAt=datetime({timezone: 'UTC'}),
        p.updatedAt=datetime({timezone: 'UTC'}),
        p.source="openline",
        p.sourceOfTruth="openline",
        p.appSource="manual";

MATCH (t:Tenant {name:"openlineai"})
MERGE (t)<-[:EMAIL_ADDRESS_BELONGS_TO_TENANT]-(e:Email {rawEmail:"max@openline.ai"})
ON CREATE SET
            e.email="max@openline.ai",
            e.id=randomUUID(),
            e.source="openline",
            e.sourceOfTruth="openline",
            e.appSource="manual",
            e.createdAt=datetime({timezone: 'UTC'}),
            e.updatedAt=datetime({timezone: 'UTC'})
WITH t, e
MERGE (t)<-[:USER_BELONGS_TO_TENANT]-(u:User)-[rel:HAS]->(e)
ON CREATE SET
            rel.primary=true,
            rel.label="WORK",
            u.id=randomUUID(),
            u.firstName="Max",
            u.lastName="Schulkin",
            u.roles=["USER","OWNER"],
    		u.createdAt=datetime({timezone: 'UTC'}),
    		u.updatedAt=datetime({timezone: 'UTC'}),
    		u.source="openline",
    		u.sourceOfTruth="openline",
    		u.appSource="manual"
MERGE (p:Player {authId: "max@openline.ai", provider: "google"})-[:IDENTIFIES {default: true}]->(u)
ON CREATE SET
        p.id=randomUUID(),
        p.identityId="8327e04a-877b-4b05-8aaa-ef6a582f7836",
        p.createdAt=datetime({timezone: 'UTC'}),
        p.updatedAt=datetime({timezone: 'UTC'}),
        p.source="openline",
        p.sourceOfTruth="openline",
        p.appSource="manual";

MATCH (t:Tenant {name:"openlineai"})
MERGE (t)<-[:EMAIL_ADDRESS_BELONGS_TO_TENANT]-(e:Email {rawEmail:"george@openline.ai"})
ON CREATE SET
            e.email="george@openline.ai",
            e.id=randomUUID(),
            e.source="openline",
            e.sourceOfTruth="openline",
            e.appSource="manual",
            e.createdAt=datetime({timezone: 'UTC'}),
            e.updatedAt=datetime({timezone: 'UTC'})
WITH t, e
MERGE (t)<-[:USER_BELONGS_TO_TENANT]-(u:User)-[rel:HAS]->(e)
ON CREATE SET
            rel.primary=true,
            rel.label="WORK",
            u.id=randomUUID(),
            u.firstName="George",
            u.lastName="Rokkos",
            u.roles=["OWNER","USER"],
    		u.createdAt=datetime({timezone: 'UTC'}),
    		u.updatedAt=datetime({timezone: 'UTC'}),
    		u.source="openline",
    		u.sourceOfTruth="openline",
    		u.appSource="manual"
MERGE (p:Player {authId: "george@openline.ai", provider: "google"})-[:IDENTIFIES {default: true}]->(u)
ON CREATE SET
        p.id=randomUUID(),
        p.identityId="46a69d24-e15a-4a04-ae44-067186ab1c87",
        p.createdAt=datetime({timezone: 'UTC'}),
        p.updatedAt=datetime({timezone: 'UTC'}),
        p.source="openline",
        p.sourceOfTruth="openline",
        p.appSource="manual";


MATCH (t:Tenant {name:"openlineai"})
MERGE (t)<-[:EMAIL_ADDRESS_BELONGS_TO_TENANT]-(e:Email {rawEmail:"vasi@openline.ai"})
ON CREATE SET
            e.email="vasi@openline.ai",
            e.id=randomUUID(),
            e.source="openline",
            e.sourceOfTruth="openline",
            e.appSource="manual",
            e.createdAt=datetime({timezone: 'UTC'}),
            e.updatedAt=datetime({timezone: 'UTC'})
WITH t, e
MERGE (t)<-[:USER_BELONGS_TO_TENANT]-(u:User)-[rel:HAS]->(e)
ON CREATE SET
            rel.primary=true,
            rel.label="WORK",
            u.id=randomUUID(),
            u.firstName="Vasi",
            u.lastName="Coscotin",
        u.roles=["OWNER","USER"],
    		u.createdAt=datetime({timezone: 'UTC'}),
    		u.updatedAt=datetime({timezone: 'UTC'}),
    		u.source="openline",
    		u.sourceOfTruth="openline",
    		u.appSource="manual"
MERGE (p:Player {authId: "vasi@openline.ai", provider: "google"})-[:IDENTIFIES {default: true}]->(u)
ON CREATE SET
        p.id=randomUUID(),
        p.identityId="c6591b09-4e2a-48ba-bff2-a30c33e26a3a",
        p.createdAt=datetime({timezone: 'UTC'}),
        p.updatedAt=datetime({timezone: 'UTC'}),
        p.source="openline",
        p.sourceOfTruth="openline",
        p.appSource="manual";



MATCH (t:Tenant {name:"openlineai"})
MERGE (t)<-[:EMAIL_ADDRESS_BELONGS_TO_TENANT]-(e:Email {rawEmail:"antoine@openline.ai"})
ON CREATE SET
            e.email="antoine@openline.ai",
            e.id=randomUUID(),
            e.source="openline",
            e.sourceOfTruth="openline",
            e.appSource="manual",
            e.createdAt=datetime({timezone: 'UTC'}),
            e.updatedAt=datetime({timezone: 'UTC'})
WITH t, e
MERGE (t)<-[:USER_BELONGS_TO_TENANT]-(u:User)-[rel:HAS]->(e)
ON CREATE SET
            rel.primary=true,
            rel.label="WORK",
            u.id=randomUUID(),
            u.firstName="Antoine",
            u.lastName="Valot",
            u.roles=["USER"],
    		u.createdAt=datetime({timezone: 'UTC'}),
    		u.updatedAt=datetime({timezone: 'UTC'}),
    		u.source="openline",
    		u.sourceOfTruth="openline",
    		u.appSource="manual"
MERGE (p:Player {authId: "antoine@openline.ai", provider: "google"})-[:IDENTIFIES {default: true}]->(u)
ON CREATE SET
        p.id=randomUUID(),
        p.createdAt=datetime({timezone: 'UTC'}),
        p.updatedAt=datetime({timezone: 'UTC'}),
        p.source="openline",
        p.sourceOfTruth="openline",
        p.appSource="manual";

MATCH (t:Tenant {name:"openlineai"})
MERGE (t)<-[:EMAIL_ADDRESS_BELONGS_TO_TENANT]-(e:Email {rawEmail:"matt@openline.ai"})
ON CREATE SET
            e.email="matt@openline.ai",
            e.id=randomUUID(),
            e.source="openline",
            e.sourceOfTruth="openline",
            e.appSource="manual",
            e.createdAt=datetime({timezone: 'UTC'}),
            e.updatedAt=datetime({timezone: 'UTC'})
WITH t, e
MERGE (t)<-[:USER_BELONGS_TO_TENANT]-(u:User)-[rel:HAS]->(e)
ON CREATE SET
            rel.primary=true,
            rel.label="WORK",
            u.id=randomUUID(),
            u.firstName="Matt",
            u.lastName="Brown",
            u.roles=["USER"],
    		u.createdAt=datetime({timezone: 'UTC'}),
    		u.updatedAt=datetime({timezone: 'UTC'}),
    		u.source="openline",
    		u.sourceOfTruth="openline",
    		u.appSource="manual"
MERGE (p:Player {authId: "matt@openline.ai", provider: "google"})-[:IDENTIFIES {default: true}]->(u)
ON CREATE SET
        p.id=randomUUID(),
        p.createdAt=datetime({timezone: 'UTC'}),
        p.updatedAt=datetime({timezone: 'UTC'}),
        p.source="openline",
        p.sourceOfTruth="openline",
        p.appSource="manual";


MATCH (t:Tenant {name:"openlineai"})
MERGE (t)<-[:EMAIL_ADDRESS_BELONGS_TO_TENANT]-(e:Email {rawEmail:"jonty@openline.ai"})
ON CREATE SET
            e.email="jonty@openline.ai",
            e.id=randomUUID(),
            e.source="openline",
            e.sourceOfTruth="openline",
            e.appSource="manual",
            e.createdAt=datetime({timezone: 'UTC'}),
            e.updatedAt=datetime({timezone: 'UTC'})
WITH t, e
MERGE (t)<-[:USER_BELONGS_TO_TENANT]-(u:User)-[rel:HAS]->(e)
ON CREATE SET
            rel.primary=true,
            rel.label="WORK",
            u.id=randomUUID(),
            u.firstName="Jonty",
            u.lastName="Knox",
            u.roles=["USER"],
    		u.createdAt=datetime({timezone: 'UTC'}),
    		u.updatedAt=datetime({timezone: 'UTC'}),
    		u.source="openline",
    		u.sourceOfTruth="openline",
    		u.appSource="manual"
MERGE (p:Player {authId: "jonty@openline.ai", provider: "google"})-[:IDENTIFIES {default: true}]->(u)
ON CREATE SET
        p.id=randomUUID(),
        p.createdAt=datetime({timezone: 'UTC'}),
        p.updatedAt=datetime({timezone: 'UTC'}),
        p.source="openline",
        p.sourceOfTruth="openline",
        p.appSource="manual";


MATCH (t:Tenant {name:"openlineai"})
    MERGE (c:Contact {id:"echotest"})-[:CONTACT_BELONGS_TO_TENANT]->(t)
    ON CREATE SET
    		c.firstName ="Echo",
            c.lastName="Test",
    		c.createdAt=datetime({timezone: 'UTC'}),
    		c.updatedAt=datetime({timezone: 'UTC'}),
    		c.source="openline",
            c.sourceOfTruth="openline",
            c.appSource="manual";

MATCH (t:Tenant {name:"openlineai"})
MERGE (t)<-[:EMAIL_ADDRESS_BELONGS_TO_TENANT]-(e:Email {rawEmail:"echo@oasis.openline.ai"})
ON CREATE SET
            e.id=randomUUID(),
            e.source="openline",
            e.sourceOfTruth="openline",
            e.appSource="manual",
            e.createdAt=datetime({timezone: 'UTC'}),
            e.updatedAt=datetime({timezone: 'UTC'})
WITH t, e
MATCH (c:Contact {id:"echotest"})-[:CONTACT_BELONGS_TO_TENANT]->(t)
MERGE (c)-[rel:HAS]->(e)
ON CREATE SET
            rel.primary=true,
            rel.label="MAIN";

MATCH (t:Tenant {name:"openlineai"})<-[:TAG_BELONGS_TO_TENANT]-(tag:Tag) SET tag:Tag_openlineai;
MATCH (t:Tenant {name:"openlineai"})<-[:ORGANIZATION_TYPE_BELONGS_TO_TENANT]-(ot:OrganizationType) SET ot:OrganizationType_openlineai;
MATCH (t:Tenant {name:"openlineai"})<-[:USER_BELONGS_TO_TENANT]-(u:User) SET u:User_openlineai;
MATCH (t:Tenant {name:"openlineai"})<-[:CONTACT_BELONGS_TO_TENANT]-(c:Contact) SET c:Contact_openlineai;
MATCH (t:Tenant {name:"openlineai"})<-[:EMAIL_ADDRESS_BELONGS_TO_TENANT]-(e:Email) SET e:Email_openlineai;

MATCH (t:Tenant {name:"openlineai"})
MERGE (e:ExternalSystem {id:"calcom"})-[:EXTERNAL_SYSTEM_BELONGS_TO_TENANT]->(t);
MATCH (t:Tenant {name:"openlineai"})
MERGE (e:ExternalSystem {id:"slack", name: "slack"})-[:EXTERNAL_SYSTEM_BELONGS_TO_TENANT]->(t);
MATCH (t:Tenant {name:"openlineai"})
MERGE (e:ExternalSystem {id:"intercom", name: "intercom"})-[:EXTERNAL_SYSTEM_BELONGS_TO_TENANT]->(t);

MERGE (c:Country {name:"Romania"}) ON CREATE SET
c.id=randomUUID(),
c.name="Romania",
c.phoneCode="40",
c.codeA2="RO",
c.codeA3="ROU",
c.appSource="csvImport",
c.createdAt=datetime({timezone: 'UTC'}),
c.source="openline",
c.sourceOfTruth= "openline",
c.updatedAt=datetime({timezone: 'UTC'});

CREATE CONSTRAINT tenant_name_unique IF NOT EXISTS FOR (t:Tenant) REQUIRE t.name IS UNIQUE;
CREATE CONSTRAINT domain_domain_unique IF NOT EXISTS FOR (n:Domain) REQUIRE n.domain IS UNIQUE;

CREATE INDEX user_id_idx IF NOT EXISTS FOR (n:User) ON (n.id);
CREATE INDEX contact_id_idx IF NOT EXISTS FOR (n:Contact) ON (n.id);
CREATE INDEX tag_id_idx IF NOT EXISTS FOR (n:Tag) ON (n.id);
CREATE INDEX organization_id_idx IF NOT EXISTS FOR (n:Organization) ON (n.id);
CREATE INDEX custom_field_id_idx IF NOT EXISTS FOR (n:CustomField) ON (n.id);
CREATE INDEX field_set_id_idx IF NOT EXISTS FOR (n:FieldSet) ON (n.id);
CREATE INDEX email_id_idx IF NOT EXISTS FOR (n:Email) ON (n.id);
CREATE INDEX email_email_idx IF NOT EXISTS FOR (n:Email) ON (n.email);
CREATE INDEX phone_id_idx IF NOT EXISTS FOR (n:PhoneNumber) ON (n.id);
CREATE INDEX phone_e164_idx IF NOT EXISTS FOR (n:PhoneNumber) ON (n.e164);
CREATE INDEX action_id_idx IF NOT EXISTS FOR (n:Action) ON (n.id);
CREATE INDEX interaction_session_id_idx IF NOT EXISTS FOR (n:InteractionSession) ON (n.id);
CREATE INDEX interaction_event_id_idx IF NOT EXISTS FOR (n:InteractionEvent) ON (n.id);
CREATE INDEX note_id_idx IF NOT EXISTS FOR (n:Note) ON (n.id);
CREATE INDEX job_role_id_idx IF NOT EXISTS FOR (n:JobRole) ON (n.id);
CREATE INDEX location_id_idx IF NOT EXISTS FOR (n:Location) ON (n.id);
CREATE INDEX log_entry_id_idx IF NOT EXISTS FOR (n:LogEntry) ON (n.id);
CREATE INDEX comment_id_idx IF NOT EXISTS FOR (n:Comment) ON (n.id);
CREATE INDEX issue_id_idx IF NOT EXISTS FOR (n:Issue) ON (n.id);
CREATE INDEX meeting_id_idx IF NOT EXISTS FOR (n:Meeting) ON (n.id);
CREATE INDEX timeline_event_id_idx IF NOT EXISTS FOR (n:TimelineEvent) ON (n.id);
CREATE INDEX opportunity_id_idx IF NOT EXISTS FOR (n:Opportunity) ON (n.id);
CREATE INDEX contract_id_idx IF NOT EXISTS FOR (n:Contract) ON (n.id);
CREATE INDEX service_line_item_id_idx IF NOT EXISTS FOR (n:ServiceLineItem) ON (n.id);
CREATE INDEX master_plan_id_idx IF NOT EXISTS FOR (n:MasterPlan) ON (n.id);
CREATE INDEX master_plan_milestone_id_idx IF NOT EXISTS FOR (n:MasterPlanMilestone) ON (n.id);

:exit;
