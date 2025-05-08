-- Seed file for populating the 8gentc database with test data

-- Sample user profiles (using Supabase Auth user IDs)
INSERT INTO profiles (id, email, name, avatar_url) 
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'demo@example.com', 'Demo User', 'https://i.pravatar.cc/150?u=demo'),
  ('00000000-0000-0000-0000-000000000002', 'test@example.com', 'Test User', 'https://i.pravatar.cc/150?u=test')
ON CONFLICT (id) DO NOTHING;

-- Sample projects
INSERT INTO projects (id, name, description, user_id)
VALUES 
  ('10000000-0000-0000-0000-000000000001', 'Business Plan Template', 'A comprehensive business plan for a tech startup', '00000000-0000-0000-0000-000000000001'),
  ('10000000-0000-0000-0000-000000000002', 'Marketing Strategy', 'Digital marketing strategy for Q3', '00000000-0000-0000-0000-000000000001'),
  ('10000000-0000-0000-0000-000000000003', 'Product Roadmap', 'Product features and timeline for the next 12 months', '00000000-0000-0000-0000-000000000002')
ON CONFLICT (id) DO NOTHING;

-- Sample plan sections for the Business Plan project
INSERT INTO plan_sections (id, project_id, section, content)
VALUES
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Context', 'This business plan outlines our tech startup focusing on AI-driven productivity tools for small businesses.'),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Goals', 'Achieve 10,000 users within 6 months of launch and secure Series A funding by Q4.'),
  ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'Timeline', 'Launch MVP in Q2, marketing campaign in Q3, and seek funding in Q4.'),
  ('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', 'Budget', 'Initial bootstrap funding of $250,000 for development, marketing, and operations.')
ON CONFLICT (id) DO NOTHING;

-- Sample plan sections for the Marketing Strategy project
INSERT INTO plan_sections (id, project_id, section, content)
VALUES
  ('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000002', 'Context', 'This marketing strategy focuses on digital channels to increase brand awareness and customer acquisition.'),
  ('20000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000002', 'Goals', 'Increase web traffic by 50% and generate 1,000 new leads per month.'),
  ('20000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000002', 'Channels', 'Social media, content marketing, SEO, and paid advertising.')
ON CONFLICT (id) DO NOTHING;

-- Sample conversations
INSERT INTO conversations (id, project_id, section)
VALUES
  ('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'ContextChat'),
  ('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'GoalsChat')
ON CONFLICT (id) DO NOTHING;

-- Sample messages
INSERT INTO messages (id, conversation_id, sender_id, is_ai, content)
VALUES
  ('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', false, 'I need help defining the context for my tech startup.'),
  ('40000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', NULL, true, 'Sure! Let\'s start by identifying your target market and the problem your startup solves.'),
  ('40000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', false, 'We\'re targeting small businesses that struggle with productivity and organization.'),
  ('40000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', false, 'What are realistic goals for a tech startup in the first year?'),
  ('40000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000002', NULL, true, 'For a tech startup, common first-year goals include: 1) Launching a minimum viable product, 2) Securing initial users/customers, 3) Gathering feedback for product improvement, 4) Establishing product-market fit, and 5) Preparing for fundraising if needed.')
ON CONFLICT (id) DO NOTHING;

-- Sample nodes for graph visualization
INSERT INTO nodes (id, project_id, label, content, type, x, y)
VALUES
  ('50000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Product Launch', 'Launch minimum viable product', 'milestone', 100, 100),
  ('50000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Marketing Campaign', 'Start digital marketing efforts', 'milestone', 300, 100),
  ('50000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'Funding Round', 'Secure Series A funding', 'milestone', 500, 100),
  ('50000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', 'User Acquisition', 'Reach 10,000 users', 'goal', 300, 300)
ON CONFLICT (id) DO NOTHING;

-- Sample edges connecting the nodes
INSERT INTO edges (id, project_id, source_id, target_id, label, type)
VALUES
  ('60000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000002', 'Leads to', 'sequence'),
  ('60000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000004', 'Enables', 'dependency'),
  ('60000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000003', 'Required for', 'dependency')
ON CONFLICT (id) DO NOTHING;

-- Sample diagrams
INSERT INTO diagrams (id, project_id, name, type, content)
VALUES
  ('70000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Project Timeline', 'mermaid', 'gantt\ntitle Project Timeline\ndateFormat YYYY-MM-DD\nsection Development\nDesign & Planning: 2023-01-01, 30d\nMVP Development: after Design & Planning, 60d\nBeta Testing: after MVP Development, 30d\nsection Marketing\nBrand Strategy: 2023-01-15, 45d\nContent Creation: after Brand Strategy, 30d\nLaunch Campaign: after Content Creation, 15d\nsection Funding\nPitch Deck: 2023-02-01, 30d\nInvestor Meetings: after Pitch Deck, 60d'),
  ('70000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Organization Chart', 'mermaid', 'flowchart TD\nCEO[CEO] --> CTO[CTO]\nCEO --> CMO[CMO]\nCEO --> CFO[CFO]\nCTO --> DEV1[Lead Developer]\nCTO --> DEV2[Backend Developer]\nCMO --> MKT1[Marketing Specialist]\nCFO --> FIN1[Financial Analyst]')
ON CONFLICT (id) DO NOTHING;

-- Sample insights
INSERT INTO insights (id, project_id, source_section, content)
VALUES
  ('80000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Context', 'The target market has significant pain points around productivity tools that are too complex for small businesses.'),
  ('80000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Goals', 'The user acquisition goal of 10,000 users is ambitious but achievable with the right marketing strategy.'),
  ('80000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002', 'Channels', 'Content marketing shows the highest ROI for SaaS products in this market segment.')
ON CONFLICT (id) DO NOTHING; 