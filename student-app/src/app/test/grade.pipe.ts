import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'gradeFilter',
})
export class GradeFilterPipe implements PipeTransform {
  transform(responses: any[], userId: string): any {
    if (!responses || !userId) return null;
    return responses.find((response) => response.s_id === userId);
  }
}
