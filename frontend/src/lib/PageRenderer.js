export default class PageRenderer {
  async render(target, source) {
    source = await fetch(source.replace("@", "./src"));

    if (!source.ok) {
      throw new Error(`Erro ao buscar página para renderizar`);
    }

    target.innerHTML = await source.text();
    return target.querySelector("*");
  }
}
