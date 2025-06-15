
-- Create teacher performance metrics table
CREATE TABLE public.teacher_performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  feedback_completion_rate DECIMAL(5,2) DEFAULT 0.00,
  lesson_quality_score DECIMAL(3,2) DEFAULT 0.00,
  attendance_rate DECIMAL(5,2) DEFAULT 0.00,
  student_progress_impact DECIMAL(5,2) DEFAULT 0.00,
  response_time_score DECIMAL(5,2) DEFAULT 0.00,
  curriculum_coverage DECIMAL(5,2) DEFAULT 0.00,
  overall_kpi_score DECIMAL(5,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create lesson feedback submissions table
CREATE TABLE public.lesson_feedback_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
  teacher_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  feedback_content TEXT NOT NULL,
  student_performance_rating INTEGER CHECK (student_performance_rating >= 1 AND student_performance_rating <= 5),
  lesson_objectives_met BOOLEAN DEFAULT false,
  homework_assigned TEXT,
  parent_communication_notes TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  payment_unlocked BOOLEAN DEFAULT false
);

-- Create teacher achievements table
CREATE TABLE public.teacher_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_type VARCHAR(50) NOT NULL, -- badge, level, milestone
  achievement_name VARCHAR(100) NOT NULL,
  achievement_description TEXT,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  points_awarded INTEGER DEFAULT 0
);

-- Create performance alerts table
CREATE TABLE public.performance_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  alert_type VARCHAR(50) NOT NULL, -- warning, coaching, celebration
  alert_message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add teacher level and payment lock fields to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS teacher_level VARCHAR(20) DEFAULT 'Bronze',
ADD COLUMN IF NOT EXISTS teacher_points INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS payment_locked BOOLEAN DEFAULT false;

-- Add feedback_required and quality_rating to lessons table
ALTER TABLE public.lessons
ADD COLUMN IF NOT EXISTS feedback_required BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS quality_rating DECIMAL(3,2),
ADD COLUMN IF NOT EXISTS feedback_submitted BOOLEAN DEFAULT false;

-- Add feedback_completion_required to payments table
ALTER TABLE public.payments
ADD COLUMN IF NOT EXISTS feedback_completion_required BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS kpi_threshold_met BOOLEAN DEFAULT false;

-- Enable RLS on new tables
ALTER TABLE public.teacher_performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_feedback_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_alerts ENABLE ROW LEVEL SECURITY;

-- RLS policies for teacher_performance_metrics
CREATE POLICY "Teachers can view their own metrics" ON public.teacher_performance_metrics
  FOR SELECT USING (teacher_id = auth.uid());

CREATE POLICY "Teachers can update their own metrics" ON public.teacher_performance_metrics
  FOR UPDATE USING (teacher_id = auth.uid());

CREATE POLICY "System can insert metrics" ON public.teacher_performance_metrics
  FOR INSERT WITH CHECK (true);

-- RLS policies for lesson_feedback_submissions
CREATE POLICY "Teachers can view their own feedback" ON public.lesson_feedback_submissions
  FOR SELECT USING (teacher_id = auth.uid());

CREATE POLICY "Teachers can insert their own feedback" ON public.lesson_feedback_submissions
  FOR INSERT WITH CHECK (teacher_id = auth.uid());

-- RLS policies for teacher_achievements
CREATE POLICY "Teachers can view their own achievements" ON public.teacher_achievements
  FOR SELECT USING (teacher_id = auth.uid());

CREATE POLICY "System can insert achievements" ON public.teacher_achievements
  FOR INSERT WITH CHECK (true);

-- RLS policies for performance_alerts
CREATE POLICY "Teachers can view their own alerts" ON public.performance_alerts
  FOR SELECT USING (teacher_id = auth.uid());

CREATE POLICY "Teachers can update their own alerts" ON public.performance_alerts
  FOR UPDATE USING (teacher_id = auth.uid());

CREATE POLICY "System can insert alerts" ON public.performance_alerts
  FOR INSERT WITH CHECK (true);

-- Create function to update performance metrics
CREATE OR REPLACE FUNCTION public.update_teacher_performance_metrics(teacher_uuid UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  feedback_rate DECIMAL(5,2);
  avg_quality DECIMAL(3,2);
  attendance DECIMAL(5,2);
BEGIN
  -- Calculate feedback completion rate
  SELECT 
    CASE 
      WHEN COUNT(*) = 0 THEN 0
      ELSE (COUNT(*) FILTER (WHERE feedback_submitted = true) * 100.0 / COUNT(*))
    END INTO feedback_rate
  FROM lessons 
  WHERE teacher_id = teacher_uuid 
    AND scheduled_at >= NOW() - INTERVAL '30 days';

  -- Calculate average lesson quality
  SELECT COALESCE(AVG(quality_rating), 0) INTO avg_quality
  FROM lessons 
  WHERE teacher_id = teacher_uuid 
    AND quality_rating IS NOT NULL
    AND scheduled_at >= NOW() - INTERVAL '30 days';

  -- Calculate attendance rate (assuming status 'completed' means attended)
  SELECT 
    CASE 
      WHEN COUNT(*) = 0 THEN 0
      ELSE (COUNT(*) FILTER (WHERE status = 'completed') * 100.0 / COUNT(*))
    END INTO attendance
  FROM lessons 
  WHERE teacher_id = teacher_uuid 
    AND scheduled_at >= NOW() - INTERVAL '30 days';

  -- Insert or update performance metrics
  INSERT INTO public.teacher_performance_metrics (
    teacher_id, 
    feedback_completion_rate, 
    lesson_quality_score, 
    attendance_rate,
    overall_kpi_score
  ) VALUES (
    teacher_uuid, 
    feedback_rate, 
    avg_quality, 
    attendance,
    (feedback_rate + (avg_quality * 20) + attendance) / 3
  )
  ON CONFLICT (teacher_id) 
  DO UPDATE SET
    feedback_completion_rate = EXCLUDED.feedback_completion_rate,
    lesson_quality_score = EXCLUDED.lesson_quality_score,
    attendance_rate = EXCLUDED.attendance_rate,
    overall_kpi_score = EXCLUDED.overall_kpi_score,
    updated_at = NOW();
END;
$$;

-- Create trigger to update metrics when lessons are updated
CREATE OR REPLACE FUNCTION public.trigger_update_teacher_metrics()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM public.update_teacher_performance_metrics(NEW.teacher_id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_teacher_metrics_trigger
  AFTER UPDATE ON public.lessons
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_update_teacher_metrics();
