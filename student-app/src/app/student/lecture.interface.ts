export interface Lecture {
  subject_name: string;
  timing: {
    date: Date;
    time: string;
  };
  join: string;
  joinedStudents?: string[];
}
