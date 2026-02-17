// Backend `TodoDto` ile bire bir.
//
// Read model — UI'ya gidecek alanlar. Backend'de UserId, audit + soft-delete bayrakları
// DTO'ya KATILMAZ — burada da yok.
//
// Yeni feature eklerken bu dosya gibi tek bir interface yazıp domain/<feature>/ altına koy.
export interface Todo {
  id: string; // GUID — TS tarafında string
  title: string;
  isCompleted: boolean;
  createdAt: string; // ISO timestamp
}
