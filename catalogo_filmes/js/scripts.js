const url = "https://rafaelescalfoni.github.io/desenv_web/filmes.json";

window.onload = function () {
  carregarFilmes();
};

function carregarFilmes() {
  const xhr = new XMLHttpRequest();

  xhr.open("GET", url, true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const filmes = JSON.parse(xhr.responseText);

        console.log(filmes);

        exibirFilmes(filmes);
      } else {
        console.error("Erro ao carregar os dados.");
      }
    }
  };

  xhr.send();
}

function exibirFilmes(filmes) {
  const catalogo = document.getElementById("catalogo");

  catalogo.innerHTML = "";

  filmes.forEach(function (filme) {
    const card = criarCardFilme(filme, filmes);
    catalogo.appendChild(card);
  });
}

function criarCardFilme(filme, todosFilmes) {
  const card = document.createElement("article");
  card.classList.add("card-filme");

  const imagem = document.createElement("img");
  imagem.classList.add("poster");
  imagem.src = filme.figura;
  imagem.alt = "Imagem de " + filme.titulo;

  const info = document.createElement("div");
  info.classList.add("info-filme");

  const topo = document.createElement("div");
  topo.classList.add("topo-card");

  const titulo = document.createElement("h2");
  titulo.textContent = filme.titulo;

  const classificacao = document.createElement("span");
  classificacao.classList.add("classificacao");
  classificacao.classList.add(definirCorClassificacao(filme.classificacao));
  classificacao.textContent = filme.classificacao === 0 ? "Livre" : filme.classificacao;

  topo.appendChild(titulo);
  topo.appendChild(classificacao);

  const estrelas = document.createElement("div");
  estrelas.classList.add("estrelas");
  estrelas.textContent = gerarEstrelas(calcularMediaRating(filme.opinioes));

  const resumo = document.createElement("p");
  resumo.classList.add("resumo");
  resumo.textContent = filme.resumo;

  const generos = criarCampo("Gêneros", filme.generos.join(", "));

  const elenco = criarCampo("Elenco", filme.elenco.join(", "));

  const semelhantes = criarCampo(
    "Títulos semelhantes",
    buscarTitulosSemelhantes(filme.titulosSemelhantes, todosFilmes).join(", ")
  );

  const opinioes = criarOpinioes(filme.opinioes);

  info.appendChild(topo);
  info.appendChild(estrelas);
  info.appendChild(resumo);
  info.appendChild(generos);
  info.appendChild(elenco);
  info.appendChild(semelhantes);
  info.appendChild(opinioes);

  card.appendChild(imagem);
  card.appendChild(info);

  return card;
}

function criarCampo(nome, valor) {
  const div = document.createElement("div");
  div.classList.add("campo");

  const strong = document.createElement("strong");
  strong.textContent = nome + ": ";

  const texto = document.createElement("span");
  texto.classList.add("lista");
  texto.textContent = valor || "Não informado";

  div.appendChild(strong);
  div.appendChild(texto);

  return div;
}

function criarOpinioes(opinioes) {
  const div = document.createElement("div");
  div.classList.add("opinioes");

  const titulo = document.createElement("strong");
  titulo.textContent = "Opiniões:";
  div.appendChild(titulo);

  opinioes.forEach(function (opiniao) {
    const blocoOpiniao = document.createElement("div");
    blocoOpiniao.classList.add("opiniao");

    const estrelas = document.createElement("div");
    estrelas.classList.add("estrelas");
    estrelas.textContent = gerarEstrelas(opiniao.rating);

    const descricao = document.createElement("p");
    descricao.textContent = opiniao.descricao;

    blocoOpiniao.appendChild(estrelas);
    blocoOpiniao.appendChild(descricao);

    div.appendChild(blocoOpiniao);
  });

  return div;
}

function definirCorClassificacao(classificacao) {
  if (classificacao >= 0 && classificacao <= 14) {
    return "verde";
  } else if (classificacao > 14 && classificacao < 18) {
    return "amarelo";
  } else {
    return "vermelho";
  }
}

function gerarEstrelas(rating) {
  let estrelas = "";

  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      estrelas += "★";
    } else {
      estrelas += "☆";
    }
  }

  return estrelas;
}

function calcularMediaRating(opinioes) {
  if (opinioes.length === 0) {
    return 0;
  }

  let soma = 0;

  opinioes.forEach(function (opiniao) {
    soma += opiniao.rating;
  });

  return Math.round(soma / opinioes.length);
}

function buscarTitulosSemelhantes(ids, todosFilmes) {
  const titulos = [];

  ids.forEach(function (id) {
    const filmeEncontrado = todosFilmes.find(function (filme) {
      return filme.id === id;
    });

    if (filmeEncontrado) {
      titulos.push(filmeEncontrado.titulo);
    }
  });

  return titulos;
}