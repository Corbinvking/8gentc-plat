-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles Table (extends the auth.users table)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security for projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own projects" ON projects
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own projects" ON projects
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own projects" ON projects
  FOR DELETE USING (auth.uid() = user_id);

-- Project members junction table (for future collaboration)
CREATE TABLE IF NOT EXISTS project_members (
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (project_id, user_id)
);

-- Set up Row Level Security for project_members
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Project members can be viewed by project participants" ON project_members
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM project_members WHERE project_id = project_members.project_id
    )
  );
CREATE POLICY "Project owners can manage members" ON project_members
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM projects WHERE id = project_members.project_id
    )
  );

-- Plan Sections Table
CREATE TABLE IF NOT EXISTS plan_sections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  section TEXT NOT NULL, -- e.g., 'Context', 'Goals', 'Timeline'
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security for plan_sections
ALTER TABLE plan_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Plan sections can be viewed by project participants" ON plan_sections
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM project_members WHERE project_id = plan_sections.project_id
      UNION
      SELECT user_id FROM projects WHERE id = plan_sections.project_id
    )
  );
CREATE POLICY "Plan sections can be modified by project participants" ON plan_sections
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM project_members WHERE project_id = plan_sections.project_id
      UNION
      SELECT user_id FROM projects WHERE id = plan_sections.project_id
    )
  );

-- Node Table (for graph visualization)
CREATE TABLE IF NOT EXISTS nodes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  label TEXT NOT NULL,
  content TEXT,
  type TEXT, -- e.g., 'concept', 'task', 'goal'
  x FLOAT,
  y FLOAT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security for nodes
ALTER TABLE nodes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Nodes can be viewed by project participants" ON nodes
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM project_members WHERE project_id = nodes.project_id
      UNION
      SELECT user_id FROM projects WHERE id = nodes.project_id
    )
  );
CREATE POLICY "Nodes can be modified by project participants" ON nodes
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM project_members WHERE project_id = nodes.project_id
      UNION
      SELECT user_id FROM projects WHERE id = nodes.project_id
    )
  );

-- Edge Table (for graph visualization)
CREATE TABLE IF NOT EXISTS edges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  source_id UUID REFERENCES nodes(id) ON DELETE CASCADE NOT NULL,
  target_id UUID REFERENCES nodes(id) ON DELETE CASCADE NOT NULL,
  label TEXT,
  type TEXT, -- e.g., 'dependency', 'relates-to'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security for edges
ALTER TABLE edges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Edges can be viewed by project participants" ON edges
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM project_members WHERE project_id = edges.project_id
      UNION
      SELECT user_id FROM projects WHERE id = edges.project_id
    )
  );
CREATE POLICY "Edges can be modified by project participants" ON edges
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM project_members WHERE project_id = edges.project_id
      UNION
      SELECT user_id FROM projects WHERE id = edges.project_id
    )
  );

-- Diagram Table (for Mermaid diagrams and other visualizations)
CREATE TABLE IF NOT EXISTS diagrams (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- e.g., 'mermaid', 'flowchart'
  content TEXT NOT NULL, -- The diagram code or data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security for diagrams
ALTER TABLE diagrams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Diagrams can be viewed by project participants" ON diagrams
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM project_members WHERE project_id = diagrams.project_id
      UNION
      SELECT user_id FROM projects WHERE id = diagrams.project_id
    )
  );
CREATE POLICY "Diagrams can be modified by project participants" ON diagrams
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM project_members WHERE project_id = diagrams.project_id
      UNION
      SELECT user_id FROM projects WHERE id = diagrams.project_id
    )
  );

-- Conversation Table (for chat history)
CREATE TABLE IF NOT EXISTS conversations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  section TEXT NOT NULL, -- e.g., 'ContextChat', 'GoalsChat', 'TimelineChat'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security for conversations
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Conversations can be viewed by project participants" ON conversations
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM project_members WHERE project_id = conversations.project_id
      UNION
      SELECT user_id FROM projects WHERE id = conversations.project_id
    )
  );
CREATE POLICY "Conversations can be modified by project participants" ON conversations
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM project_members WHERE project_id = conversations.project_id
      UNION
      SELECT user_id FROM projects WHERE id = conversations.project_id
    )
  );

-- Message Table (for chat messages)
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  is_ai BOOLEAN DEFAULT FALSE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security for messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Messages can be viewed by conversation participants" ON messages
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM project_members WHERE project_id IN (
        SELECT project_id FROM conversations WHERE id = messages.conversation_id
      )
      UNION
      SELECT user_id FROM projects WHERE id IN (
        SELECT project_id FROM conversations WHERE id = messages.conversation_id
      )
    )
  );
CREATE POLICY "Messages can be inserted by conversation participants" ON messages
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM project_members WHERE project_id IN (
        SELECT project_id FROM conversations WHERE id = messages.conversation_id
      )
      UNION
      SELECT user_id FROM projects WHERE id IN (
        SELECT project_id FROM conversations WHERE id = messages.conversation_id
      )
    )
  );

-- AI Cache Table (for caching AI responses)
CREATE TABLE IF NOT EXISTS ai_cache (
  key TEXT PRIMARY KEY,
  response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Set up Row Level Security for ai_cache
ALTER TABLE ai_cache ENABLE ROW LEVEL SECURITY;
-- All users can read from cache
CREATE POLICY "All users can read from AI cache" ON ai_cache FOR SELECT TO authenticated USING (true);
-- Only the system can insert/update the cache (handled via service role)

-- Insight Table (for sharing insights between sections)
CREATE TABLE IF NOT EXISTS insights (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  source_section TEXT NOT NULL, -- Where the insight came from
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security for insights
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Insights can be viewed by project participants" ON insights
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM project_members WHERE project_id = insights.project_id
      UNION
      SELECT user_id FROM projects WHERE id = insights.project_id
    )
  );
CREATE POLICY "Insights can be modified by project participants" ON insights
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM project_members WHERE project_id = insights.project_id
      UNION
      SELECT user_id FROM projects WHERE id = insights.project_id
    )
  );

-- Function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for all tables with updated_at columns
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_plan_sections_updated_at
BEFORE UPDATE ON plan_sections
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_nodes_updated_at
BEFORE UPDATE ON nodes
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_edges_updated_at
BEFORE UPDATE ON edges
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_diagrams_updated_at
BEFORE UPDATE ON diagrams
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_conversations_updated_at
BEFORE UPDATE ON conversations
FOR EACH ROW EXECUTE FUNCTION update_updated_at(); 