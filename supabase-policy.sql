-- Выполни один раз: Supabase -> SQL Editor -> New query -> вставь -> Run
-- Разрешает загружать (но не удалять и не перезаписывать) файлы в бакет reels.
-- Чтение публичное (бакет Public), лимит размера и типы файлов задаются в настройках бакета.
create policy "reels_upload" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'reels');
