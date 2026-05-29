import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE } from '../db/db.module';
import type { CreateClientDto } from './dto/create-client.dto';
import type { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @Inject(SUPABASE) private readonly supabase: SupabaseClient,
  ) {}

  async findAll() {
    const { data, error } = await this.supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) throw new Error(error.message);
    return data;
  }

  async findOne(id: number) {
    const { data, error } = await this.supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) throw new NotFoundException(`Client #${id} not found`);
    return data;
  }

  async create(dto: CreateClientDto) {
    const { data, error } = await this.supabase
      .from('clients')
      .insert(dto)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async update(id: number, dto: UpdateClientDto) {
    await this.findOne(id);
    const { data, error } = await this.supabase
      .from('clients')
      .update(dto)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async remove(id: number) {
    await this.findOne(id);
    const { error } = await this.supabase
      .from('clients')
      .delete()
      .eq('id', id);
    if (error) throw new Error(error.message);
  }
}
