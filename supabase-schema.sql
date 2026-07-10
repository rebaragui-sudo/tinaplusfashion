-- Tabela de produtos
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT DEFAULT '',
  images TEXT[] DEFAULT '{}',
  category TEXT DEFAULT '',
  colors TEXT[] DEFAULT '{}',
  sizes TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de variantes de produto (cor + tamanho + estoque)
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  color TEXT NOT NULL,
  size TEXT NOT NULL,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de pedidos
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  total_price DECIMAL(10,2) NOT NULL,
  shipping_method TEXT DEFAULT '',
  shipping_price DECIMAL(10,2) DEFAULT 0,
  items JSONB DEFAULT '[]',
  shipping_data JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending',
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de perfis de usuário
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
  full_name TEXT DEFAULT '',
  cpf TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  address JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Políticas de segurança (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Permitir leitura pública de produtos
CREATE POLICY "Produtos são públicos" ON products FOR SELECT USING (true);
CREATE POLICY "Variantes são públicas" ON product_variants FOR SELECT USING (true);

-- Permitir usuários autenticados inserirem seus próprios pedidos
CREATE POLICY "Usuários podem ver seus pedidos" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Qualquer um pode criar pedido" ON orders FOR INSERT WITH CHECK (true);

-- Perfis: usuário só vê/altera o próprio
CREATE POLICY "Perfil próprio" ON profiles FOR ALL USING (auth.uid() = id);