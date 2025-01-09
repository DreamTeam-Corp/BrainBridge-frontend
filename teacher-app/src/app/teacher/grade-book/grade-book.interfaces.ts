export interface Student {
  _id: string;
  name: string;
  enrollment_no: number;
}

export interface Submission {
  _id: string;
  submission_name: string;
  uploaded: Array<{
    id: string;
    grade: number;
    comment: string;
  }>;
}

export interface Test {
  _id: string;
  test_name: string;
  test_responses: Array<{
    s_id: string;
    marks: number;
  }>;
}
