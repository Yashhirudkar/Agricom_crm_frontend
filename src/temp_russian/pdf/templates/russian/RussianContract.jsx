import React from "react";
import ContractHeader from "../../shared/ContractHeader";
import { formatDate, partnerAddress, incotermLabel } from "../../shared/helpers";
import RussianSpecification from "./RussianSpecification";
import PageFooter from "../../shared/PageFooter";

// ─── A4 Page Container ────────────────────────────────────────────────────────
/**
 * A single fixed A4 page.
 * On screen: looks like a Word page (white, shadowed, 210mm wide).
 * On print: each A4Page maps to exactly one printed page.
 */
const A4Page = ({ children, contract }) => (
  <div
    className="a4-page"
    style={{
      width: "210mm",
      minHeight: "297mm",
      padding: "15mm",
      background: "#fff",
      boxSizing: "border-box",
      pageBreakAfter: "always",
      breakAfter: "page",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <div style={{ flex: 1 }}>
      {children}
    </div>
    {contract && <PageFooter contract={contract} variant="russian" />}
  </div>
);

// ─── Bilingual row ────────────────────────────────────────────────────────────
const BiRow = ({ ruContent, enContent, className = "" }) => (
  <div
    className={`bilingual-grid ${className}`}
    style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "6mm",
      marginBottom: "3mm",
      breakInside: "avoid",
      pageBreakInside: "avoid"
    }}
  >
    <div style={{ textAlign: "justify" }}>{ruContent}</div>
    <div style={{ textAlign: "justify" }}>{enContent}</div>
  </div>
);

// ─── Section header ───────────────────────────────────────────────────────────
const SectionHeader = ({ num, ruTitle, enTitle }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "6mm",
      marginTop: "4mm",
      marginBottom: "2mm",
    }}
  >
    <div style={{ fontWeight: "bold", textTransform: "uppercase", fontSize: "10.5pt" }}>
      {num}. {ruTitle}
    </div>
    <div style={{ fontWeight: "bold", textTransform: "uppercase", fontSize: "10.5pt" }}>
      {num}. {enTitle}
    </div>
  </div>
);

// ─── Thin divider ─────────────────────────────────────────────────────────────
const Divider = () => (
  <div style={{ margin: "2mm 0" }} />
);

// ─── Russian Export Contract ───────────────────────────────────────────────────
/**
 * Russian Export contract — fixed A4 page layout.
 * Each <A4Page> maps exactly to one printed page.
 * No browser pagination is used.
 *
 * Page layout:
 *   Page 1 — Header + Title + Preamble + §1 Subject + §2 Delivery
 *   Page 2 — §3 Sum + §4 Payments + §5 Guarantees + §6-§11 (brief clauses)
 *   Page 3 — §12 Banking Details + Signature Block
 *   Page 4+ — Specification No. 1 (independent document)
 */
export default function RussianContract({ contract, renderValue }) {
  // ── Derived values ────────────────────────────────────────────────────────
  const sellerName = (
    contract.sellerCompanyName ||
    contract.seller?.entityName ||
    "ТОО «Патока С»"
  ).toUpperCase();

  const buyerName = (
    contract.buyerCompanyName ||
    contract.buyer?.entityName ||
    "AGRICOM IMPEX"
  ).toUpperCase();

  const sellerAddress = contract.seller
    ? partnerAddress(contract.seller)
    : (contract.sellerCompanyName || "110007 РК г. Костанай, ул. Уральская, 18").toUpperCase();

  const buyerAddress = contract.buyer
    ? partnerAddress(contract.buyer)
    : (contract.buyerCompanyName || "202, AMALTAS APARTMENT, RAJNAGAR, NAGPUR (MS) INDIA - 440013").toUpperCase();

  const sellerDirector = contract.sellerAuthorizedSignatory || "Михайленко А.А.";
  const buyerDirector = contract.buyerAuthorizedSignatory || "Mr. Akash Ghadse";

  const item = contract.items?.[0];
  const productName = item?.product?.name || "Семена льна масличного (коричневого)";
  const productQuality =
    [item?.product?.qualitySubType, item?.product?.specification].filter(Boolean).join(" - ") ||
    "не для посева, урожай 2025 года (Linum usitatissimum)";
  const curr = contract.currencyCode || "EUR";
  const incoterm = incotermLabel(contract) || "FCA Костанай";
  const contractNo = contract.contractNumber || "06-02";
  const contractDateStr = formatDate(contract.contractDate);

  // ── Shared inline style tokens ────────────────────────────────────────────
  const TEXT = { fontSize: "10pt", lineHeight: 1.35, fontFamily: "'Times New Roman', Times, serif" };
  const BOLD = { ...TEXT, fontWeight: "bold" };
  const SMALL = { ...TEXT, fontSize: "9pt" };

  return (
    <div style={{ fontFamily: "'Times New Roman', Times, serif" }}>

      {/* ════════════════════════════════════════════════════════════════════
          PAGE 1 — Header · Title · Preamble · §1 Subject · §2 Delivery
          ════════════════════════════════════════════════════════════════════ */}
      <A4Page contract={contract}>
        {/* Contract title row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            marginBottom: "4mm",
          }}
        >
          <div style={{ ...TEXT, fontWeight: "600" }}>
            {renderValue("ru_header_date", `«${contractDateStr}»г.`)}
          </div>
          <div
            style={{
              ...BOLD,
              fontSize: "11pt",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              textAlign: "center",
              whiteSpace: "nowrap",
            }}
          >
            КОНТРАКТ № {contractNo} / CONTRACT № {contractNo}
          </div>
          <div style={{ ...TEXT, fontWeight: "600", textAlign: "right" }}>
            {renderValue("en_header_date", contractDateStr)}
          </div>
        </div>

        {/* Preamble */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "6mm",
            marginBottom: "4mm",
          }}
          className="bilingual-grid"
        >
          <p style={{ ...TEXT, textAlign: "justify" }}>
            <strong>{renderValue("ru_seller_title", sellerName)}</strong> в лице директора{" "}
            <strong>{renderValue("ru_seller_dir", sellerDirector)}</strong>, действующего на основании
            Устава, именуемое в дальнейшем «Продавец», с одной стороны, и{" "}
            <strong>{renderValue("ru_buyer_title", buyerName)}</strong> в лице директора{" "}
            <strong>{renderValue("ru_buyer_dir", buyerDirector)}</strong>, действующего на основании
            Устава, именуемое в дальнейшем «Покупатель», с другой стороны, заключили настоящий
            контракт о нижеследующем:
          </p>
          <p style={{ ...TEXT, textAlign: "justify" }}>
            <strong>{renderValue("en_seller_title", sellerName)}</strong>, represented by Director{" "}
            <strong>{renderValue("en_seller_dir", sellerDirector)}</strong>, acting in accordance with
            the Articles of Association, hereinafter referred to as the "Seller," on the one hand,
            and <strong>{renderValue("en_buyer_title", buyerName)}</strong>, represented by Director{" "}
            <strong>{renderValue("en_buyer_dir", buyerDirector)}</strong>, acting in accordance with
            the Articles of Association, hereinafter referred to as the "Buyer," on the other hand,
            have entered into this contract as follows:
          </p>
        </div>

        <Divider />

        {/* §1 SUBJECT */}
        <SectionHeader num={1} ruTitle="ПРЕДМЕТ КОНТРАКТА" enTitle="SUBJECT OF THE CONTRACT" />
        <BiRow
          ruContent={
            <p style={TEXT}>
              1.1 Продавец обязуется поставить, а Покупатель принять и оплатить{" "}
              <strong>{renderValue("ru_product_name", productName)}</strong> ({productQuality}),
              происхождения Казахстан, урожая 2025 года (Linum usitatissimum), именуемых в дальнейшем
              Товар, на условиях <strong>{incoterm}</strong> с погрузкой в жд. вагон (зерновоз) Код
              ТН ВЭД 1204009000.
            </p>
          }
          enContent={
            <p style={TEXT}>
              1.1 The Seller agrees to deliver, and the Buyer agrees to accept and pay for{" "}
              <strong>{renderValue("en_product_name", productName)}</strong> ({productQuality}),
              originating in Kazakhstan, from the 2025 harvest (Linum usitatissimum), hereinafter
              referred to as the Goods, under <strong>{incoterm}</strong> terms with loading onto a
              railroad car (grain car) HS Code 1204009000.
            </p>
          }
        />

        <Divider />

        {/* §2 DELIVERY */}
        <SectionHeader
          num={2}
          ruTitle="СРОКИ И УСЛОВИЯ ПОСТАВКИ"
          enTitle="TERMS AND CONDITIONS OF DELIVERY"
        />
        <BiRow
          ruContent={
            <div style={TEXT}>
              <p style={{ marginBottom: "1.5mm" }}>
                2.1. Условие поставки: {incoterm}, улица Шакшак Жанибек батыра 18. Код станции
                684001.
              </p>
              <p style={{ marginBottom: "1.5mm" }}>
                2.2. Продавец обязуется в течение 3 (трех) рабочих дней с даты отгрузки Товара
                направить Покупателю товаросопроводительные документы.
              </p>
              <p style={{ marginBottom: "1.5mm" }}>
                2.3. Поставка Товара осуществляется Продавцом железнодорожным транспортом жд.
                вагон (зерновоз). Минимальная партия единовременно поставляемого товара составляет
                7 (семь) вагонов или 490 тонн.
              </p>
              <p style={{ marginBottom: "1mm" }}>- Место отгрузки указано в пункте 2.1.</p>
              <p style={{ marginBottom: "1mm" }}>
                - Срок отгрузки Товара указывается в Спецификациях к настоящему Контракту.
              </p>
              <p style={{ marginBottom: "1.5mm" }}>
                - Срок погрузки Товара в вагоны составляет 3 (три) рабочих дня с момента подачи
                вагонов на железнодорожный тупик 6-12.
              </p>
              <p style={{ marginBottom: "1.5mm" }}>
                2.4. Датой поставки Товара считается дата отметки в товаросопроводительных
                документах.
              </p>
              <p style={{ marginBottom: "1.5mm" }}>
                2.5. Право собственности на Товар и риск случайной гибели или повреждения переходит
                к Покупателю с момента передачи Товара перевозчику (оформление ж/д накладной).
              </p>
              <p>
                2.6. Грузоотправителем по данному контракту может быть третье лицо по соглашению
                сторон, оговоренное в Спецификациях.
              </p>
            </div>
          }
          enContent={
            <div style={TEXT}>
              <p style={{ marginBottom: "1.5mm" }}>
                2.1. Delivery condition: {incoterm} 18 Shakshyak Street, Batyr Zhanibek. Station
                code 684001.
              </p>
              <p style={{ marginBottom: "1.5mm" }}>
                2.2. The Seller agrees to send the shipping documents to the Buyer within 3 (three)
                business days from the date of shipment of the Goods.
              </p>
              <p style={{ marginBottom: "1.5mm" }}>
                2.3. The Seller shall deliver the Goods by rail using grain cars. The minimum
                shipment size for a single delivery by rail is 7 (seven) cars or 490 metric tons.
              </p>
              <p style={{ marginBottom: "1mm" }}>
                - The place of shipment is specified in Section 2.1.
              </p>
              <p style={{ marginBottom: "1mm" }}>
                - The shipment date for the Goods is specified in the Specifications to this
                Contract.
              </p>
              <p style={{ marginBottom: "1.5mm" }}>
                - The time required to load the Goods into the railcars is 3 (three) business days
                from the time the railcars are delivered to rail siding 6-12.
              </p>
              <p style={{ marginBottom: "1.5mm" }}>
                2.4. The date of delivery of the Goods is the date indicated on the shipping
                documents.
              </p>
              <p style={{ marginBottom: "1.5mm" }}>
                2.5. Title to the Goods and risk of accidental loss or damage pass to the Buyer upon
                delivery to the carrier (issuance of rail waybill).
              </p>
              <p>
                2.6. The consignor under this Contract may be a third party, subject to agreement
                specified in the Specifications.
              </p>
            </div>
          }
        />
      </A4Page>

      {/* ════════════════════════════════════════════════════════════════════
          PAGE 2 — §3 Sum · §4 Payments · §5 Guarantees · §6 Force Majeure
          ════════════════════════════════════════════════════════════════════ */}
      <A4Page contract={contract}>

        {/* §3 SUM */}
        <SectionHeader num={3} ruTitle="СУММА КОНТРАКТА" enTitle="SUM OF CONTRACT" />
        <BiRow
          ruContent={
            <div style={TEXT}>
              <p style={{ marginBottom: "1.5mm" }}>
                3.1. Цена на товар в Евро согласовывается сторонами в Спецификациях к настоящему
                Контракту согласно базису поставки, определенному в пункте 2.1.
              </p>
              <p>3.2. Валюта платежа — {curr}.</p>
            </div>
          }
          enContent={
            <div style={TEXT}>
              <p style={{ marginBottom: "1.5mm" }}>
                3.1. The price of the goods in Euro shall be agreed upon by the parties in the
                Specifications to this Contract in accordance with the delivery terms specified in
                Section 2.1.
              </p>
              <p>3.2. The currency of payment is {curr}.</p>
            </div>
          }
        />

        <Divider />

        {/* §4 PAYMENTS */}
        <SectionHeader num={4} ruTitle="ПЛАТЕЖИ" enTitle="PAYMENTS" />
        <BiRow
          ruContent={
            <div style={TEXT}>
              <p style={{ marginBottom: "1.5mm" }}>
                4.1. Покупатель в соответствии с настоящим Контрактом производит оплату за Товар
                на условиях, предусмотренных Спецификациями.
              </p>
              <p style={{ marginBottom: "1.5mm" }}>
                4.2. Оплата осуществляется простым банковским переводом со счёта Покупателя на
                расчётный счёт Продавца, указанный в Контракте.
              </p>
              <p style={{ marginBottom: "1.5mm" }}>
                4.3. Покупатель обязан оповестить Продавца об оплате, предоставив копии банковских
                переводов с акцептом банка по электронной почте. Датой оплаты считается дата
                поступления средств на расчётный счёт Продавца.
              </p>
              <p>
                4.4. Плательщиком по настоящему Контракту может быть третье лицо, о чём Покупатель
                должен проинформировать Продавца письменно.
              </p>
            </div>
          }
          enContent={
            <div style={TEXT}>
              <p style={{ marginBottom: "1.5mm" }}>
                4.1. The Buyer in accordance with this Contract makes payment for the Goods under
                the conditions stipulated by the Specifications.
              </p>
              <p style={{ marginBottom: "1.5mm" }}>
                4.2. Payment shall be made by simple bank transfer from the Buyer's account to the
                Seller's bank account specified in this Contract.
              </p>
              <p style={{ marginBottom: "1.5mm" }}>
                4.3. The Buyer is required to notify the Seller of payment by providing copies of
                bank transfers with bank's confirmation via email. The payment date is the date
                funds credit the Seller's account.
              </p>
              <p>
                4.4. A third party may be the payer under this Contract, of which the Buyer must
                inform the Seller in writing.
              </p>
            </div>
          }
        />

        <Divider />

        {/* §5 GUARANTEES */}
        <SectionHeader num={5} ruTitle="ГАРАНТИИ" enTitle="GUARANTEES" />
        <BiRow
          ruContent={
            <div style={TEXT}>
              <p style={{ marginBottom: "1.5mm" }}>
                5.1. Продавец гарантирует, что качество Товаров соответствует следующим
                показателям:
              </p>
              <ul style={{ paddingLeft: "5mm", marginBottom: "1.5mm" }}>
                <li>Сорная примесь basis 3%</li>
                <li>Влажность basis 9%</li>
                <li>Содержание масла min 42%</li>
              </ul>
              <p>
                Товар должен быть в нормальном состоянии, без постороннего запаха, плесени, не
                окисленным, без токсичных веществ и складских вредителей. Окончательное качество
                подтверждается сертификатом качества Продавца.
              </p>
            </div>
          }
          enContent={
            <div style={TEXT}>
              <p style={{ marginBottom: "1.5mm" }}>
                5.1. The Seller guarantees that the quality of Goods fully complies with the
                following indicators:
              </p>
              <ul style={{ paddingLeft: "5mm", marginBottom: "1.5mm" }}>
                <li>Impurity content (basis): 3%</li>
                <li>Moisture content (basis): 9%</li>
                <li>Oil content: min. 42%</li>
              </ul>
              <p>
                The goods must be in good condition, free of odor other than characteristic of
                flaxseed, free of mold, not oxidized, free of toxic substances and storage pests.
                Final quality confirmed by Seller's quality certificate.
              </p>
            </div>
          }
        />

        <Divider />

        {/* §6 SANCTIONS / FORCE MAJEURE — brief */}
        <SectionHeader num={6} ruTitle="ФОРС-МАЖОР" enTitle="FORCE MAJEURE" />
        <BiRow
          ruContent={
            <div style={TEXT}>
              <p>
                6.1. Стороны освобождаются от ответственности за полное или частичное неисполнение
                обязательств по настоящему Контракту, если оно явилось следствием непреодолимой
                силы, возникшей после заключения Контракта в результате событий чрезвычайного
                характера, которые стороны не могли предвидеть и предотвратить.
              </p>
            </div>
          }
          enContent={
            <div style={TEXT}>
              <p>
                6.1. The parties are released from liability for full or partial non-fulfillment of
                obligations under this Contract if it resulted from force majeure circumstances
                arising after the conclusion of the Contract as a result of extraordinary events
                that the parties could not foresee or prevent.
              </p>
            </div>
          }
        />

        <Divider />

      </A4Page>

      {/* ════════════════════════════════════════════════════════════════════
          PAGE 3 — §7 Claims · §8 Arbitration · §9 Term · §10 Language · §11 Other
          ════════════════════════════════════════════════════════════════════ */}
      <A4Page contract={contract}>

        {/* §7 CLAIMS */}
        <SectionHeader num={7} ruTitle="ПРЕТЕНЗИИ" enTitle="CLAIMS" />
        <BiRow
          ruContent={
            <div style={TEXT}>
              <p>
                7.1. Претензии по качеству товара принимаются Продавцом в течение 30 (тридцати)
                дней с даты прибытия товара на таможенный склад в стране назначения.
              </p>
            </div>
          }
          enContent={
            <div style={TEXT}>
              <p>
                7.1. Quality claims shall be accepted by the Seller within 30 (thirty) days from
                the date of arrival of the goods at the customs warehouse in the country of
                destination.
              </p>
            </div>
          }
        />

        <Divider />

        {/* §8 ARBITRATION */}
        <SectionHeader num={8} ruTitle="АРБИТРАЖ" enTitle="ARBITRATION" />
        <BiRow
          ruContent={
            <div style={TEXT}>
              <p>
                8.1. Все споры, разногласия или требования, возникающие из настоящего Контракта или
                в связи с ним, в том числе касающиеся его нарушения, прекращения или
                недействительности, подлежат разрешению в Арбитражном суде Республики Казахстан.
              </p>
            </div>
          }
          enContent={
            <div style={TEXT}>
              <p>
                8.1. All disputes, disagreements or claims arising out of or in connection with
                this Contract, including those relating to its violation, termination or invalidity,
                shall be resolved in the Arbitration Court of the Republic of Kazakhstan.
              </p>
            </div>
          }
        />

        <Divider />

        {/* §9 TERM */}
        <SectionHeader num={9} ruTitle="СРОК ДЕЙСТВИЯ КОНТРАКТА" enTitle="TERM OF THE CONTRACT" />
        <BiRow
          ruContent={
            <p style={TEXT}>
              9.1. Настоящий Контракт вступает в силу с момента его подписания обеими сторонами и
              действует до полного исполнения сторонами своих обязательств.
            </p>
          }
          enContent={
            <p style={TEXT}>
              9.1. This Contract enters into force upon signing by both parties and remains in
              effect until full fulfillment of obligations by the parties.
            </p>
          }
        />

        <Divider />

        {/* §10 LANGUAGE */}
        <SectionHeader num={10} ruTitle="ЯЗЫК КОНТРАКТА" enTitle="LANGUAGE OF THE CONTRACT" />
        <BiRow
          ruContent={
            <p style={TEXT}>
              10.1. Настоящий Контракт составлен на русском и английском языках в двух экземплярах,
              имеющих одинаковую юридическую силу — по одному для каждой Стороны.
            </p>
          }
          enContent={
            <p style={TEXT}>
              10.1. This Contract is made in Russian and English in two copies, each having equal
              legal force — one copy for each Party.
            </p>
          }
        />

        <Divider />

        {/* §11 OTHER TERMS */}
        <SectionHeader num={11} ruTitle="ПРОЧИЕ УСЛОВИЯ" enTitle="OTHER CONDITIONS" />
        <BiRow
          ruContent={
            <div style={TEXT}>
              <p style={{ marginBottom: "1.5mm" }}>
                11.1. Все изменения и дополнения к настоящему Контракту действительны лишь в том
                случае, если они совершены в письменной форме и подписаны обеими Сторонами.
              </p>
              <p>
                11.2. Настоящий Контракт является рамочным. Объём, количество, цена и условия
                поставки каждой конкретной партии Товара определяются в соответствующих
                Спецификациях, являющихся неотъемлемой частью настоящего Контракта.
              </p>
            </div>
          }
          enContent={
            <div style={TEXT}>
              <p style={{ marginBottom: "1.5mm" }}>
                11.1. All amendments and additions to this Contract shall be valid only if made in
                writing and signed by both Parties.
              </p>
              <p>
                11.2. This Contract is a framework agreement. The volume, quantity, price and
                delivery terms of each specific batch of Goods shall be determined in the relevant
                Specifications, which are an integral part of this Contract.
              </p>
            </div>
          }
        />
      </A4Page>

      {/* ════════════════════════════════════════════════════════════════════
          PAGE 4 — §12 Banking Details + Signature Block
          Signatures are ALWAYS on this page, never floating elsewhere.
          ════════════════════════════════════════════════════════════════════ */}
      <A4Page contract={contract}>

        <SectionHeader
          num={12}
          ruTitle="ЮРИДИЧЕСКИЕ АДРЕСА И РЕКВИЗИТЫ СТОРОН"
          enTitle="LEGAL ADDRESSES AND BANKING DETAILS"
        />

        {/* Banking details — two columns */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "6mm",
            marginTop: "3mm",
          }}
          className="bilingual-grid"
        >
          {/* ── Russian column ── */}
          <div style={{ ...SMALL }}>
            {/* Seller RU */}
            <p style={{ ...BOLD, fontSize: "9pt", textTransform: "uppercase" }}>Продавец / Seller:</p>
            <p style={{ ...BOLD, fontSize: "9pt" }}>{sellerName}</p>
            <p>БИН 031140006317</p>
            <p>Адрес: {sellerAddress}</p>
            <p>Св-во по НДС 39001 № 0007559 от 20.09.2012г</p>
            <p>АО «Народный Банк Казахстана»</p>
            <p>БИК HSBKKZKX | Расчетный счет в евро: KZ76017221000002646</p>
            <p>e-mail: info@sarybay.kz | тел: WA +77770275555</p>

            <div style={{ borderTop: "0.5px solid #aaa", marginTop: "4mm", paddingTop: "3mm" }} />

            {/* Buyer RU */}
            <p style={{ ...BOLD, fontSize: "9pt", textTransform: "uppercase" }}>Покупатель / Buyer:</p>
            <p style={{ ...BOLD, fontSize: "9pt" }}>{buyerName}</p>
            <p>JURIDICAL ADDRESS: {buyerAddress}</p>
            <p style={{ ...BOLD, fontSize: "9pt", marginTop: "2mm" }}>BANK DETAILS:</p>
            <p>
              ICICI BANK LIMITED, NAGPUR BRANCH, AKARSHAN BUSIPLEX 26, CENTRAL BAZAR ROAD,
              RAMDASPETH, NAGPUR-440010
            </p>
            <p>SWIFT CODE - ICICINBBCTS | ACCOUNT NUMBER: 624205012998</p>
            <p style={{ ...BOLD, fontSize: "9pt", marginTop: "2mm" }}>INTERMEDIARY BANK DETAILS:</p>
            <p>JP MORGAN CHASE BANK, NEW YORK | SWIFT: CHASUS33XXX | ACC: 0011427374</p>
            <p style={{ ...BOLD, fontSize: "9pt", marginTop: "2mm" }}>NOSTRO BANK DETAILS:</p>
            <p>JP MORGAN CHASE BANK, N.A. | SWIFT: CHASUS33 | ACC: 199253953</p>
            <p>DBS BANK INDIA LIMITED | SWIFT: DBSSINBBXXX | ACC: 8871210000025878</p>
            <p>e-mail: docs@agricomimpex.com | WA: +91 98222 20151</p>
          </div>

          {/* ── English column ── */}
          <div style={{ ...SMALL }}>
            {/* Seller EN */}
            <p style={{ ...BOLD, fontSize: "9pt", textTransform: "uppercase" }}>Seller:</p>
            <p style={{ ...BOLD, fontSize: "9pt" }}>{sellerName}</p>
            <p>BIN 031140006317</p>
            <p>Address: {sellerAddress}</p>
            <p>JSC "Halyk Bank of Kazakhstan"</p>
            <p>BIC: HSBKKZKX | Account: KZ76017221000002646</p>
            <p>e-mail: info@sarybay.kz | WA: +77770275555</p>

            <div style={{ borderTop: "0.5px solid #aaa", marginTop: "4mm", paddingTop: "3mm" }} />

            {/* Buyer EN */}
            <p style={{ ...BOLD, fontSize: "9pt", textTransform: "uppercase" }}>Buyer:</p>
            <p style={{ ...BOLD, fontSize: "9pt" }}>{buyerName}</p>
            <p>ADDRESS: {buyerAddress}</p>
            <p style={{ ...BOLD, fontSize: "9pt", marginTop: "2mm" }}>BANK DETAILS:</p>
            <p>ICICI BANK LIMITED, NAGPUR BRANCH</p>
            <p>SWIFT CODE: ICICINBBCTS | ACC: 624205012998</p>
            <p style={{ ...BOLD, fontSize: "9pt", marginTop: "2mm" }}>INTERMEDIARY BANK DETAILS:</p>
            <p>JP MORGAN CHASE BANK, NEW YORK | SWIFT: CHASUS33XXX | ACC: 0011427374</p>
            <p style={{ ...BOLD, fontSize: "9pt", marginTop: "2mm" }}>NOSTRO BANK DETAILS:</p>
            <p>JP MORGAN CHASE BANK, N.A. | SWIFT: CHASUS33 | ACC: 199253953</p>
            <p>DBS BANK INDIA LIMITED | SWIFT: DBSSINBBXXX | ACC: 8871210000025878</p>
            <p>e-mail: docs@agricomimpex.com | WA: +91 98222 20151</p>
          </div>
        </div>

        {/* ── Signature Blocks Section at bottom of Section 12 ── */}
        <div style={{ marginTop: "6mm", paddingTop: "3mm", borderTop: "0.5px solid #ccc" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8mm" }}>
            {/* Seller Signature Block */}
            <div>
              <p style={{ ...BOLD, fontSize: "9.5pt" }}>Продавец / Seller:</p>
              <p style={{ ...BOLD, fontSize: "9pt", marginTop: "1mm" }}>
                Директор / Director: {sellerDirector}
              </p>
              <div
                className="relative flex items-center justify-center"
                style={{
                  width: "250px",
                  height: "140px",
                  marginBottom: "-22px",
                  marginTop: "2mm",
                  background: "transparent",
                  isolation: "isolate",
                  position: "relative",
                }}
              >
                {contract.sellerCompanySeal && (
                  <img
                    src={contract.sellerCompanySeal}
                    alt="Seller Seal"
                    className="absolute object-contain"
                    style={{
                      width: "250px",
                      height: "140px",
                      zIndex: 1,
                      mixBlendMode: "multiply",
                      filter: "contrast(1.5) brightness(1.0) saturate(1.3)",
                    }}
                  />
                )}
                {contract.sellerSignature && (
                  <img
                    src={contract.sellerSignature}
                    alt="Seller Signature"
                    className="absolute object-contain"
                    style={{
                      width: "250px",
                      height: "140px",
                      bottom: "0px",
                      zIndex: 3,
                      mixBlendMode: "multiply",
                      filter: "contrast(1.5) brightness(1.0)",
                    }}
                  />
                )}
              </div>
              <div style={{ borderBottom: "1px solid #000", width: "90%", position: "relative", zIndex: 10 }} />
              <p style={{ fontSize: "9pt", fontWeight: "bold", position: "relative", zIndex: 10, marginTop: "1.5mm" }}>
                {sellerName}
              </p>
            </div>

            {/* Buyer Signature Block */}
            <div>
              <p style={{ ...BOLD, fontSize: "9.5pt" }}>Покупатель / Buyer:</p>
              <p style={{ ...BOLD, fontSize: "9pt", marginTop: "1mm" }}>
                Директор / Director: {buyerDirector}
              </p>
              <div
                className="relative flex items-center justify-center"
                style={{
                  width: "250px",
                  height: "140px",
                  marginBottom: "-22px",
                  marginTop: "2mm",
                  background: "transparent",
                  isolation: "isolate",
                  position: "relative",
                }}
              >
                {contract.buyerCompanySeal && (
                  <img
                    src={contract.buyerCompanySeal}
                    alt="Buyer Seal"
                    className="absolute object-contain"
                    style={{
                      width: "250px",
                      height: "140px",
                      zIndex: 1,
                      mixBlendMode: "multiply",
                      filter: "contrast(1.5) brightness(1.0) saturate(1.3)",
                    }}
                  />
                )}
                {contract.buyerSignature && (
                  <img
                    src={contract.buyerSignature}
                    alt="Buyer Signature"
                    className="absolute object-contain"
                    style={{
                      width: "250px",
                      height: "140px",
                      bottom: "0px",
                      zIndex: 3,
                      mixBlendMode: "multiply",
                      filter: "contrast(1.5) brightness(1.0)",
                    }}
                  />
                )}
              </div>
              <div style={{ borderBottom: "1px solid #000", width: "90%", position: "relative", zIndex: 10 }} />
              <p style={{ fontSize: "9pt", fontWeight: "bold", position: "relative", zIndex: 10, marginTop: "1.5mm" }}>
                {buyerName}
              </p>
            </div>
          </div>
        </div>
      </A4Page>

      {/* ════════════════════════════════════════════════════════════════════
          PAGE 4+ — Specification No. 1 (independent document)
          Always starts on a new page.
          ════════════════════════════════════════════════════════════════════ */}
      <RussianSpecification contract={contract} renderValue={renderValue} />
    </div>
  );
}
