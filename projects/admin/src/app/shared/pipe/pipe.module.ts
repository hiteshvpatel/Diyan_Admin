import { NgModule } from '@angular/core';
import { ArraySortPipeDesc, ArraySortPipeAsc, GroupByPipe, NiceTimePipe, ArraySortPipeSimple } from './common.pipe';

@NgModule({
  imports: [],
  declarations: [NiceTimePipe, GroupByPipe, ArraySortPipeDesc, ArraySortPipeAsc, ArraySortPipeSimple],
  exports: [NiceTimePipe, GroupByPipe, ArraySortPipeDesc, ArraySortPipeAsc, ArraySortPipeSimple]
})
export class PipeModule { }
