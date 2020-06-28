//autobind decorator
function autobind(
  target: any,
  methodName: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjDescriptor;
}

class ProjectInput {
  templateElement: HTMLTemplateElement;
  divElement: HTMLDivElement;
  formElement: HTMLFormElement;

  titleInputELement: HTMLInputElement;
  descriptionInputELement: HTMLInputElement;
  peopleInputELement: HTMLInputElement;

  constructor() {
    this.templateElement = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;
    this.divElement = document.getElementById("app")! as HTMLDivElement;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.formElement = importedNode.firstElementChild as HTMLFormElement;
    this.formElement.id = "user-input";

    this.titleInputELement = this.formElement.querySelector(
      "#title"
    )! as HTMLInputElement;
    this.descriptionInputELement = this.formElement.querySelector(
      "#description"
    )! as HTMLInputElement;
    this.peopleInputELement = this.formElement.querySelector(
      "#people"
    )! as HTMLInputElement;
    this.attach();
  }

  @autobind
  private submmitHandler(event: Event) {
    event.preventDefault();
    console.log(this.titleInputELement.value);
  }
  private configure() {
    this.formElement.addEventListener("submit", this.submmitHandler);
  }

  private attach() {
    this.divElement.insertAdjacentElement("afterbegin", this.formElement);
  }
}

const prjInput = new ProjectInput();
