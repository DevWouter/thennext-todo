import { Directive, ElementRef, HostListener, AfterContentChecked, OnInit, OnDestroy } from "@angular/core";

@Directive({
  selector: "textarea[appTextareaResize]"
})
export class TextareaResizeDirective implements AfterContentChecked, OnDestroy, OnInit {
  original: HTMLTextAreaElement;
  clone: HTMLTextAreaElement;

  constructor(
    private el: ElementRef,
  ) {
    if (this.el.nativeElement.tagName === "textarea") {
      console.error(`appTextareaResize can only be used on textarea and NOT on ${this.el.nativeElement.tagName}`);
    }
    this.original = this.el.nativeElement as HTMLTextAreaElement;
  }

  ngOnInit(): void {
    this.clone = this.createClone();
    const parent = this.original.parentElement as HTMLElement;
    parent.appendChild(this.clone);
  }

  ngAfterContentChecked(): void {
    this.update();
  }

  ngOnDestroy(): void {
    const parent = this.original.parentElement as HTMLElement;
    parent.removeChild(this.clone);
  }

  private update() {
    if (this.clone) {
      this.clone.value = this.original.value + " i";
      const h1 = this.clone.scrollHeight;
      this.clone.value = this.original.value + "W";
      const h2 = this.clone.scrollHeight;

      const scrollHeight = Math.max(h1, h2);

      this.original.style.height = scrollHeight + "px";
    }
  }

  createClone(): HTMLTextAreaElement {
    const clone = this.original.cloneNode() as HTMLTextAreaElement;
    clone.style.position = "absolute";
    clone.style.left = "0";
    clone.style.right = "0";
    clone.style.visibility = "hidden";
    clone.style.height = "auto";
    return clone;
  }

}
