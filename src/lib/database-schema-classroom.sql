
-- Complete 1-on-1 Virtual Classroom Database Schema

-- Enhanced users table for classroom system
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  full_name VARCHAR NOT NULL,
  role VARCHAR CHECK (role IN ('teacher', 'student')) NOT NULL,
  avatar_url TEXT,
  timezone VARCHAR DEFAULT 'UTC',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lessons table for scheduling
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id VARCHAR UNIQUE NOT NULL,
  teacher_id UUID REFERENCES users(id) NOT NULL,
  student_id UUID REFERENCES users(id) NOT NULL,
  title VARCHAR NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration INTEGER DEFAULT 60, -- minutes
  status VARCHAR CHECK (status IN ('scheduled', 'live', 'completed', 'cancelled')) DEFAULT 'scheduled',
  meeting_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Classroom sessions for tracking active sessions
CREATE TABLE IF NOT EXISTS public.classroom_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES lessons(id) NOT NULL,
  room_id VARCHAR NOT NULL,
  teacher_connected BOOLEAN DEFAULT false,
  student_connected BOOLEAN DEFAULT false,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  recording_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat messages for classroom chat
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES classroom_sessions(id) NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  message TEXT NOT NULL,
  message_type VARCHAR CHECK (message_type IN ('text', 'file', 'system')) DEFAULT 'text',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Whiteboard data for synchronized drawing
CREATE TABLE IF NOT EXISTS public.whiteboard_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES classroom_sessions(id) NOT NULL,
  drawing_data JSONB NOT NULL,
  created_by UUID REFERENCES users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE classroom_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE whiteboard_data ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for lessons
CREATE POLICY "Teachers can view their lessons" ON lessons FOR SELECT USING (teacher_id = auth.uid());
CREATE POLICY "Students can view their lessons" ON lessons FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Teachers can create lessons" ON lessons FOR INSERT WITH CHECK (teacher_id = auth.uid());
CREATE POLICY "Teachers can update their lessons" ON lessons FOR UPDATE USING (teacher_id = auth.uid());

-- RLS Policies for classroom sessions
CREATE POLICY "Users can view sessions for their lessons" ON classroom_sessions FOR SELECT USING (
  EXISTS (SELECT 1 FROM lessons WHERE lessons.id = lesson_id AND (teacher_id = auth.uid() OR student_id = auth.uid()))
);

-- RLS Policies for chat messages
CREATE POLICY "Users can view chat in their sessions" ON chat_messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM classroom_sessions cs
    JOIN lessons l ON l.id = cs.lesson_id
    WHERE cs.id = session_id AND (l.teacher_id = auth.uid() OR l.student_id = auth.uid())
  )
);
CREATE POLICY "Users can send chat messages" ON chat_messages FOR INSERT WITH CHECK (user_id = auth.uid());

-- RLS Policies for whiteboard data
CREATE POLICY "Users can view whiteboard in their sessions" ON whiteboard_data FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM classroom_sessions cs
    JOIN lessons l ON l.id = cs.lesson_id
    WHERE cs.id = session_id AND (l.teacher_id = auth.uid() OR l.student_id = auth.uid())
  )
);
CREATE POLICY "Users can create whiteboard data" ON whiteboard_data FOR INSERT WITH CHECK (created_by = auth.uid());

-- Functions for room ID generation
CREATE OR REPLACE FUNCTION generate_room_id(student_name TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN LOWER(student_name) || '-' || SUBSTRING(gen_random_uuid()::TEXT FROM 1 FOR 8);
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
