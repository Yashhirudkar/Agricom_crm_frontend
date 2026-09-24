import React from "react";
import ContractHeader from "../../shared/ContractHeader";
import { formatDate, incotermLabel } from "../../shared/helpers";
import PageFooter from "../../shared/PageFooter";

/**
 * A single fixed A4 page.
 * Identical to the one used by RussianContract so both files are self-contained.
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

const BiRow = ({ ruContent, enContent }) => (
  <div
    className="bilingual-grid"
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

const Divider = () => (
  <div style={{ margin: "2mm 0" }} />
);

/**
 * RussianSpecification — Specification No. 1 annex to the Russian Export Contract.
 * Rendered as fixed A4 pages starting after the main contract body.
 * Always begins on a fresh page.
 *
 * Props:
 *  - contract: full contract object
 *  - renderValue(key, defaultValue): handles printOverrides / isCustomizing mode
 */
export default function RussianSpecification({ contract, renderValue }) {
  const incoterm = incotermLabel(contract) || "FCA Костанай";
  const item = contract.items?.[0];
  const productName = item?.product?.name || "Семена льна масличного (коричневый)";
  const productQuality =
    [item?.product?.qualitySubType, item?.product?.specification].filter(Boolean).join(" - ") ||
    "не для посева, урожай 2025 года (Linum usitatissimum)";
  const qtyNum = item ? Number(item.quantity) : 490;
  const unitPriceNum = item ? Number(item.unitPrice) : 406;
  const totalAmountNum = item ? Number(item.amount || qtyNum * unitPriceNum) : 198940;
  const curr = contract.currencyCode || "EUR";

  const sellerName = (
    contract.sellerCompanyName || contract.seller?.entityName || "ТОО «Патока С»"
  ).toUpperCase();
  const buyerName = (
    contract.buyerCompanyName || contract.buyer?.entityName || "AGRICOM IMPEX"
  ).toUpperCase();
  const sellerDirector = contract.sellerAuthorizedSignatory || "Михайленко А.А.";
  const buyerDirector = contract.buyerAuthorizedSignatory || "Mr. Akash Ghadse";
  const contractNo = contract.contractNumber || "06-02";
  const contractDateStr = formatDate(contract.contractDate);

  const TEXT = { fontSize: "10pt", lineHeight: 1.35, fontFamily: "'Times New Roman', Times, serif" };
  const BOLD = { ...TEXT, fontWeight: "bold" };

  return (
    <div style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      {/* ════════════════════════════════════════════════════════════════════
          SPECIFICATION PAGE 1 — Header, Preamble, Items, Quality
          ════════════════════════════════════════════════════════════════════ */}
      <A4Page contract={contract}>
        {/* Annex header — bilingual */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "6mm",
            marginBottom: "4mm",
          }}
          className="bilingual-grid"
        >
          <div style={TEXT}>
            <p>Приложение к контракту № {contractNo}</p>
            <p>от «{contractDateStr}» года.</p>
            <p style={{ ...BOLD, fontSize: "11pt", textTransform: "uppercase", marginTop: "2mm" }}>
              СПЕЦИФИКАЦИЯ № 1
            </p>
            <p>«{contractDateStr}»г.</p>
          </div>
          <div style={{ ...TEXT, textAlign: "right" }}>
            <p>Annex to the Contract № {contractNo}</p>
            <p>From {contractDateStr}</p>
            <p style={{ ...BOLD, fontSize: "11pt", textTransform: "uppercase", marginTop: "2mm" }}>
              SPECIFICATION № 1
            </p>
            <p>{contractDateStr}</p>
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
            <strong>{sellerName}</strong> в лице директора <strong>{sellerDirector}</strong>,
            действующего на основании Устава, именуемое в дальнейшем «Продавец», с одной стороны,
            и <strong>{buyerName}</strong> в лице директора <strong>{buyerDirector}</strong>,
            действующего на основании Устава, именуемое в дальнейшем «Покупатель», с другой
            стороны, заключили настоящую спецификацию о нижеследующем:
          </p>
          <p style={{ ...TEXT, textAlign: "justify" }}>
            <strong>{sellerName}</strong>, represented by Director <strong>{sellerDirector}</strong>,
            acting in accordance with Articles of Association, hereinafter referred to as the
            "Seller," on the one hand, and <strong>{buyerName}</strong>, represented by Director{" "}
            <strong>{buyerDirector}</strong>, acting in accordance with Articles of Association,
            hereinafter referred to as the "Buyer," on the other hand, have entered into this
            specification as follows:
          </p>
        </div>

        <Divider />

        {/* §1 Item details */}
        <BiRow
          ruContent={
            <div style={TEXT}>
              <p style={{ ...BOLD, marginBottom: "2mm" }}>
                1. ПРОДАВЕЦ обязуется передать в собственность ПОКУПАТЕЛЯ на условиях {incoterm},
                улица Шакшак Жанибек батыра 18. Код станции 684001. с погрузкой в жд. вагон
                (зерновоз) Код ТН ВЭД 1204009000 следующий ТОВАР, в следующем количестве и по
                следующей цене:
              </p>
              <p>
                • <strong>Наименование товара:</strong>{" "}
                {renderValue("spec_ru_name", productName)} ({productQuality});
              </p>
              <p>• <strong>Упаковка:</strong> насыпью в вагон</p>
              <p>
                • <strong>Кол-во (тн), +/- 10%:</strong> {qtyNum.toLocaleString("ru-RU")}
              </p>
              <p>
                • <strong>Цена /тн (НДС 0%):</strong> {curr}{" "}
                {unitPriceNum.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </p>
              <p>
                • <strong>Сумма, (НДС 0%):</strong> {curr}{" "}
                {totalAmountNum.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </p>
              <p style={BOLD}>
                • Итого: (НДС 0%) {curr}{" "}
                {totalAmountNum.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </p>
              <p>• <strong>Страна происхождения товара:</strong> Казахстан</p>
            </div>
          }
          enContent={
            <div style={TEXT}>
              <p style={{ ...BOLD, marginBottom: "2mm" }}>
                1. The SELLER agrees to transfer ownership to the BUYER under FCA terms at{" "}
                {incoterm}, 18 Shakshaq Zhanibek Batyr Street. Station code 684001. Loading into a
                railroad car (grain car) HS Code 1204009000, in the following quantity and at the
                following price:
              </p>
              <p>
                • <strong>Product Name:</strong>{" "}
                {renderValue("spec_en_name", productName)} ({productQuality});
              </p>
              <p>• <strong>Packaging:</strong> bulk in a railcar</p>
              <p>
                • <strong>Quantity (metric tons), +/- 10%:</strong>{" "}
                {qtyNum.toLocaleString("en-IN")}
              </p>
              <p>
                • <strong>Price per metric ton (VAT 0%):</strong> {curr}{" "}
                {unitPriceNum.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </p>
              <p>
                • <strong>Total amount (VAT 0%):</strong> {curr}{" "}
                {totalAmountNum.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </p>
              <p style={BOLD}>
                • Grand total (VAT 0%): {curr}{" "}
                {totalAmountNum.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </p>
              <p>• <strong>Country of origin:</strong> Kazakhstan</p>
            </div>
          }
        />

        <Divider />

        {/* §2 Quality */}
        <BiRow
          ruContent={
            <div style={TEXT}>
              <p style={BOLD}>2. Качество товара:</p>
              <ul style={{ paddingLeft: "5mm", marginTop: "1mm", marginBottom: "1.5mm" }}>
                <li>Сорная примесь basis 3 %.</li>
                <li>Влажность basis 9 %.</li>
                <li>Содержание масла min. 42 %.</li>
              </ul>
              <p>
                Товар должен быть в нормальном состоянии, без запаха, без плесени, не окисленным,
                без токсичных веществ, складских вредителей и насекомых. Окончательное качество
                подтверждается сертификатом качества продавца.
              </p>
            </div>
          }
          enContent={
            <div style={TEXT}>
              <p style={BOLD}>2. Product quality:</p>
              <ul style={{ paddingLeft: "5mm", marginTop: "1mm", marginBottom: "1.5mm" }}>
                <li>Impurity content (basis): 3%.</li>
                <li>Moisture content (basis): 9%.</li>
                <li>Oil content: min. 42%.</li>
              </ul>
              <p>
                The product must be in good condition, free of odor other than characteristic of
                flaxseed, free of mold, not oxidized, and free of toxic substances, storage pests,
                and insects. Final quality confirmed by Seller's quality certificate.
              </p>
            </div>
          }
        />

        <Divider />

        {/* §3 Consignor */}
        <BiRow
          ruContent={
            <p style={TEXT}>
              <strong>3. Грузоотправителем</strong> по настоящей спецификации является
              грузоотправитель, указанный в товаросопроводительных документах. Грузополучатель:
              согласно письменной заявке Покупателя.
            </p>
          }
          enContent={
            <p style={TEXT}>
              <strong>3. The consignor</strong> according to this specification is the consignor
              indicated in the international consignment note. Consignee: as specified in the
              Buyer's written request.
            </p>
          }
        />

        <Divider />

        {/* §4 Shipment deadline */}
        <BiRow
          ruContent={
            <p style={TEXT}>
              <strong>4. Срок отгрузки товара:</strong> до 01.08.2026 г.
            </p>
          }
          enContent={
            <p style={TEXT}>
              <strong>4. The shipment of goods:</strong> Shipment deadline: by August 1, 2026.
            </p>
          }
        />

        <Divider />
      </A4Page>

      {/* ════════════════════════════════════════════════════════════════════
          SPECIFICATION PAGE 2 — Loading, Payments, Signatures
          ════════════════════════════════════════════════════════════════════ */}
      <A4Page contract={contract}>
        {/* §5 Loading point */}
        <BiRow
          ruContent={
            <p style={TEXT}>
              <strong>5. Пункт погрузки:</strong> Костанай, улица Шакшак Жанибек батыра 18,
              железнодорожный тупик 6-12.
            </p>
          }
          enContent={
            <p style={TEXT}>
              <strong>5. Loading point:</strong> Kostanay, 18 Shakshaq Zhanibek Batyr Street,
              railroad siding 6-12.
            </p>
          }
        />

        <Divider />

        {/* §6 Payment terms */}
        <BiRow
          ruContent={
            <div style={TEXT}>
              <p style={BOLD}>
                6. Срок оплаты: Оплата по настоящему Договору осуществляется Покупателем в
                следующем порядке:
              </p>
              <p style={{ marginTop: "1.5mm" }}>
                - 10% (десять процентов) от общей стоимости Товара оплачивается Покупателем в
                качестве предварительной оплаты (аванса) на основании счета, выставленного
                Продавцом, в течение 3 (трех) дней с даты подписания контракта.
              </p>
              <p style={{ marginTop: "1.5mm" }}>
                - Окончательный расчет в размере 90% стоимости Товара производится Покупателем в
                течение 2 (или 3) рабочих дней с даты подачи вагонов на подъездной путь (тупик),
                но до начала отгрузки Товара. Продавец приступает к отгрузке Товара после
                поступления на его расчетный счет полной оплаты стоимости Товара (100%).
              </p>
            </div>
          }
          enContent={
            <div style={TEXT}>
              <p style={BOLD}>
                6. Payment Terms: Payment under this agreement shall be made by the Buyer as
                follows:
              </p>
              <p style={{ marginTop: "1.5mm" }}>
                - 10% (ten percent) of the total cost of the Goods shall be paid by the Buyer as a
                prepayment (advance payment) based on an invoice issued by the Seller within 3
                (three) days from the date of signing the contract.
              </p>
              <p style={{ marginTop: "1.5mm" }}>
                - The Buyer shall make the final payment, equal to 90% of the cost of the Goods,
                within 2 (or 3) business days from the date the railcars are delivered to the
                siding (dead-end track), but before shipment of the Goods begins. The Seller shall
                commence shipment of the Goods upon receipt of full payment (100%) into its bank
                account.
              </p>
            </div>
          }
        />

        <Divider />

        {/* §7 Integral part */}
        <BiRow
          ruContent={
            <p style={TEXT}>
              <strong>7. Настоящая СПЕЦИФИКАЦИЯ</strong> является неотъемлемой частью КОНТРАКТА, и
              на все отношения СТОРОН по настоящей СПЕЦИФИКАЦИИ распространяются условия КОНТРАКТА.
            </p>
          }
          enContent={
            <p style={TEXT}>
              <strong>7. These SPECIFICATIONS</strong> are an integral part of the CONTRACT, and
              the terms of the CONTRACT shall govern all relations between the PARTIES under these
              SPECIFICATIONS.
            </p>
          }
        />

        <Divider />

        {/* §8 Copies */}
        <BiRow
          ruContent={
            <p style={TEXT}>
              <strong>8. Настоящая СПЕЦИФИКАЦИЯ</strong> составлена на русском и английском языке
              в 2-х экземплярах – по одному для каждой из СТОРОН.
            </p>
          }
          enContent={
            <p style={TEXT}>
              <strong>8. These SPECIFICATIONS</strong> are drawn up in Russian and English in two
              copies—one for each of the PARTIES.
            </p>
          }
        />

        {/* ── Signature lines — always on spec page ── */}
        <div style={{ marginTop: "6mm", paddingTop: "3mm", borderTop: "0.5px solid #ccc" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8mm" }}>

            {/* ── SELLER ── */}
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

            {/* ── BUYER ── */}
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
    </div>
  );
}
