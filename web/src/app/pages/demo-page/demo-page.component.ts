import { Component, OnInit } from '@angular/core';
import * as nacl from "tweetnacl";
import { encodeBase64 } from "tweetnacl-util";
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-demo-page',
  templateUrl: './demo-page.component.html',
  styleUrls: ['./demo-page.component.scss']
})
export class DemoPageComponent implements OnInit {
  $encrypted: Observable<string>;
  _privateKey: Uint8Array;
  privateKey: string;
  _privateKeyHash: Uint8Array;
  privateKeyHash: string;
  _nonce: Uint8Array;
  nonce: string;

  private $plainText = new Subject<string>();
  private _plainText: string;
  public get plainText(): string {
    return this._plainText;
  }
  public set plainText(v: string) {
    this._plainText = v;
    this.$plainText.next(v);
  }

  constructor() { }

  ngOnInit(): void {
    this._privateKey = nacl.randomBytes(32);
    this.privateKey = encodeBase64(this._privateKey);
    this._privateKeyHash = nacl.hash(this._privateKey)
    this.privateKeyHash = encodeBase64(this._privateKeyHash);
    this._nonce = nacl.randomBytes(24);
    this.nonce = encodeBase64(this._nonce);

    this.$encrypted = this.$plainText.pipe(
      map(x => new TextEncoder().encode(x)),
      map(x => nacl.secretbox(x, this._nonce, this._privateKey)),
      map(x => encodeBase64(x))
    );
  }
}
