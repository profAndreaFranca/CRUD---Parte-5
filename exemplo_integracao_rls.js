// ============================================================================
// Exemplo de Integração JavaScript com Políticas RLS
// ============================================================================

// Configuração do Supabase (já existe no seu código)
const SUPABASE_URL = "https://qhhhtozrfvhefbtrdina.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoaGh0b3pyZnZoZWZidHJkaW5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NTAzMjgsImV4cCI6MjA5NjUyNjMyOH0.S72wfz144zzzNnvAVVLZlZNjr69onv2biuB8l-Zjr3A";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ============================================================================
// 1. AUTENTICAÇÃO - Login
// ============================================================================

async function fazerLogin(email, senha) {
  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: email,
      password: senha
    });

    if (error) {
      console.error("Erro ao fazer login:", error.message);
      alert("Erro ao fazer login: " + error.message);
      return false;
    }

    console.log("Login realizado com sucesso!");
    console.log("Usuário ID:", data.user.id);
    console.log("Email:", data.user.email);
    
    return true;
  } catch (erro) {
    console.error("Erro:", erro);
    return false;
  }
}

// ============================================================================
// 2. AUTENTICAÇÃO - Registrar novo usuário
// ============================================================================

async function registrarUsuario(email, senha) {
  try {
    const { data, error } = await supabaseClient.auth.signUp({
      email: email,
      password: senha
    });

    if (error) {
      console.error("Erro ao registrar:", error.message);
      alert("Erro ao registrar: " + error.message);
      return false;
    }

    alert("Usuário registrado! Verifique seu email para confirmar.");
    return true;
  } catch (erro) {
    console.error("Erro:", erro);
    return false;
  }
}

// ============================================================================
// 3. AUTENTICAÇÃO - Logout
// ============================================================================

async function fazerLogout() {
  try {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
      console.error("Erro ao fazer logout:", error.message);
      return false;
    }

    console.log("Logout realizado com sucesso!");
    return true;
  } catch (erro) {
    console.error("Erro:", erro);
    return false;
  }
}

// ============================================================================
// 4. VERIFICAR USUÁRIO AUTENTICADO
// ============================================================================

async function verificarAutenticacao() {
  try {
    const { data, error } = await supabaseClient.auth.getUser();

    if (error || !data.user) {
      console.log("Usuário não autenticado");
      return null;
    }

    console.log("Usuário autenticado:", data.user.email);
    return data.user;
  } catch (erro) {
    console.error("Erro:", erro);
    return null;
  }
}

// ============================================================================
// 5. CRUD - CREATE (Criar produto)
// ============================================================================

async function criarProduto(nomeProduto, descricaoProduto, categoriaProduto, precoProduto, imagemProduto) {
  try {
    // Verificar se usuário está autenticado
    const usuario = await verificarAutenticacao();
    if (!usuario) {
      alert("Você precisa estar logado para criar um produto!");
      return false;
    }

    const produto = {
      nome: nomeProduto.trim(),
      descricao: descricaoProduto.trim(),
      categoria: categoriaProduto,
      preco: parseFloat(precoProduto),
      imagem_url: imagemProduto.trim(),
      // criado_por: usuario.id  // Descomente se sua tabela tiver esta coluna
    };

    const { data, error } = await supabaseClient
      .from("produtos")
      .insert([produto])
      .select(); // Retorna o produto criado

    if (error) {
      console.error("Erro ao criar produto:", error.message);
      alert("Erro ao criar produto: " + error.message);
      return false;
    }

    console.log("Produto criado com sucesso:", data);
    alert("Produto cadastrado com sucesso!");
    return true;
  } catch (erro) {
    console.error("Erro:", erro);
    return false;
  }
}

// ============================================================================
// 6. CRUD - READ (Ler/Listar produtos)
// ============================================================================

async function listarProdutos() {
  try {
    const { data, error } = await supabaseClient
      .from("produtos")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Erro ao carregar produtos:", error.message);
      return [];
    }

    console.log("Produtos carregados:", data);
    return data || [];
  } catch (erro) {
    console.error("Erro:", erro);
    return [];
  }
}

// ============================================================================
// 7. CRUD - UPDATE (Atualizar produto)
// ============================================================================

async function atualizarProduto(idProduto, dadosAtualizados) {
  try {
    // Verificar se usuário está autenticado
    const usuario = await verificarAutenticacao();
    if (!usuario) {
      alert("Você precisa estar logado para atualizar um produto!");
      return false;
    }

    const { data, error } = await supabaseClient
      .from("produtos")
      .update(dadosAtualizados)
      .eq("id", idProduto)
      .select();

    if (error) {
      console.error("Erro ao atualizar produto:", error.message);
      alert("Erro ao atualizar produto: " + error.message);
      return false;
    }

    console.log("Produto atualizado:", data);
    alert("Produto atualizado com sucesso!");
    return true;
  } catch (erro) {
    console.error("Erro:", erro);
    return false;
  }
}

// ============================================================================
// 8. CRUD - DELETE (Deletar produto)
// ============================================================================

async function deletarProduto(idProduto) {
  try {
    // Verificar se usuário está autenticado
    const usuario = await verificarAutenticacao();
    if (!usuario) {
      alert("Você precisa estar logado para deletar um produto!");
      return false;
    }

    if (!confirm("Tem certeza que deseja deletar este produto?")) {
      return false;
    }

    const { error } = await supabaseClient
      .from("produtos")
      .delete()
      .eq("id", idProduto);

    if (error) {
      console.error("Erro ao deletar produto:", error.message);
      alert("Erro ao deletar produto: " + error.message);
      return false;
    }

    console.log("Produto deletado com sucesso!");
    alert("Produto deletado com sucesso!");
    return true;
  } catch (erro) {
    console.error("Erro:", erro);
    return false;
  }
}

// ============================================================================
// 9. INTEGRAÇÃO COM FORMULÁRIO (Exemplo completo)
// ============================================================================

function integrarFormulario() {
  // Supondo que você tenha elementos HTML como:
  // <input id="email" type="email">
  // <input id="senha" type="password">
  // <button id="btnLogin">Login</button>
  // <button id="btnCriarProduto">Criar Produto</button>

  const btnLogin = document.getElementById("btnLogin");
  const btnLogout = document.getElementById("btnLogout");
  const btnCriarProduto = document.getElementById("btnCadastrar");

  if (btnLogin) {
    btnLogin.addEventListener("click", async () => {
      const email = document.getElementById("email")?.value;
      const senha = document.getElementById("senha")?.value;
      
      if (!email || !senha) {
        alert("Preencha email e senha!");
        return;
      }

      await fazerLogin(email, senha);
    });
  }

  if (btnLogout) {
    btnLogout.addEventListener("click", async () => {
      await fazerLogout();
    });
  }

  if (btnCriarProduto) {
    btnCriarProduto.addEventListener("click", async () => {
      const nome = document.getElementById("nomeProduto")?.value;
      const descricao = document.getElementById("descricaoProduto")?.value;
      const categoria = document.getElementById("categoriaProduto")?.value;
      const preco = document.getElementById("precoProduto")?.value;
      const imagem = document.getElementById("imagemProduto")?.value;

      if (!nome || !descricao || !categoria || !preco || !imagem) {
        alert("Preencha todos os campos!");
        return;
      }

      const sucesso = await criarProduto(nome, descricao, categoria, preco, imagem);
      if (sucesso) {
        // Limpar formulário e recarregar lista
        document.getElementById("formProduto")?.reset();
        const produtos = await listarProdutos();
        mostrarProdutos(produtos);
      }
    });
  }
}

// ============================================================================
// 10. OBSERVAR MUDANÇAS EM TEMPO REAL (Real-time subscriptions)
// ============================================================================

function observarProdutosEmTempoReal() {
  const subscription = supabaseClient
    .channel("public:produtos")
    .on(
      "postgres_changes",
      {
        event: "*", // Todos os eventos (INSERT, UPDATE, DELETE)
        schema: "public",
        table: "produtos",
      },
      (payload) => {
        console.log("Mudança detectada:", payload);

        if (payload.eventType === "INSERT") {
          console.log("Novo produto adicionado:", payload.new);
        } else if (payload.eventType === "UPDATE") {
          console.log("Produto atualizado:", payload.new);
        } else if (payload.eventType === "DELETE") {
          console.log("Produto deletado:", payload.old);
        }

        // Recarregar lista de produtos
        carregarProdutos();
      }
    )
    .subscribe();

  return subscription;
}

// ============================================================================
// 11. TRATAMENTO DE ERROS - RLS Error Handler
// ============================================================================

function tratarErroRLS(erro) {
  if (erro.message.includes("row violates row-level security")) {
    return "Você não tem permissão para fazer esta ação. Faça login!";
  } else if (erro.message.includes("JWT expired")) {
    return "Sua sessão expirou. Faça login novamente!";
  } else if (erro.message.includes("invalid JWT")) {
    return "Erro de autenticação. Faça login novamente!";
  } else if (erro.message.includes("relation does not exist")) {
    return "Tabela de produtos não encontrada!";
  } else {
    return "Erro: " + erro.message;
  }
}

// ============================================================================
// 12. INICIALIZAÇÃO
// ============================================================================

async function inicializar() {
  console.log("Inicializando aplicação...");

  // Verificar se usuário já está logado
  const usuario = await verificarAutenticacao();
  if (usuario) {
    console.log("Bem-vindo, " + usuario.email);
  }

  // Integrar eventos do formulário
  integrarFormulario();

  // Observar mudanças em tempo real (opcional)
  observarProdutosEmTempoReal();

  // Carregar produtos iniciais
  const produtos = await listarProdutos();
  console.log("Produtos carregados:", produtos.length);
}

// Executar quando a página carregar
document.addEventListener("DOMContentLoaded", inicializar);

// ============================================================================
// EXEMPLO DE USO NO CONSOLE DO NAVEGADOR
// ============================================================================

/*
// 1. Registrar usuário
await registrarUsuario("usuario@exemplo.com", "senha123");

// 2. Fazer login
await fazerLogin("usuario@exemplo.com", "senha123");

// 3. Criar produto
await criarProduto(
  "Notebook",
  "Notebook para desenvolvimento",
  "Eletrônicos",
  2500,
  "https://exemplo.com/notebook.jpg"
);

// 4. Listar produtos
const produtos = await listarProdutos();
console.table(produtos);

// 5. Atualizar produto
await atualizarProduto("id-do-produto", {
  preco: 3000,
  descricao: "Novo preço!"
});

// 6. Deletar produto
await deletarProduto("id-do-produto");

// 7. Logout
await fazerLogout();
*/
