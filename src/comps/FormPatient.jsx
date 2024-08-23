export default function FormPatient({ patient, updating }) {
  return (
    <>
      <div>Form Patient {updating && "Updating"}</div>;
      <div className=" flex-col md:flex-row">
        <details className="info-blk w-full ">
          <summary className={StyleFormBlockTitle()}>
            Information du Patient
          </summary>

          {false && (
            <div>
              <div>Photo</div>
              <div>
                <img src={props.newPatPhoto || patient} width={200} />
              </div>

              <MultiFileUploaderCont
                count={1}
                notifyUploadDone={notifyUploadDone}
              />
            </div>
          )}

          <div>Departement (MAT, SIN, SOP)</div>
          {props.newPatDep}

          <IconButtonsCont
            data={CATEGORIES_PATIENTS}
            onRadioButtonSelected={onRadioButtonSelected}
            hidefirst
            selectedcode={props.newPatDep}
          />

          {false && (
            <select
              value={props.newPatDep || DEPARTEMENTS.SIN.code}
              className={StyleInputText}
              onChange={(e) => props.setNewPatDep(e.target.value)}
            >
              {Object.values(DEPARTEMENTS).map((dep, i) => (
                <option key={i} value={dep.code}>
                  {dep.label}
                </option>
              ))}
            </select>
          )}

          <div>Nom</div>
          <input
            className={StyleInputText}
            value={props.newPatNom}
            onChange={(e) => props.setNewPatNom(e.target.value)}
            type="text"
          />
          <div>Phone</div>
          <input
            className={StyleInputText}
            value={props.newPatPhone}
            onChange={(e) => props.setNewPatPhone(e.target.value)}
            type="tel"
          />
          <div>Addresse</div>
          <input
            className={StyleInputText}
            value={props.newPatAdd}
            onChange={(e) => props.setNewPatAdd(e.target.value)}
            type="text"
          />

          <h5>Date de Naissance</h5>
          {/* <input
            type="date"
            value={props.newPatDOB}
            onChange={(e) => props.setNewPatDOB(e.target.value)}
          /> */}

          <DOBInput
            setDateIsValid={(v) => setdobisvalid(v)}
            initDate={props.newPatDOB}
            onNewDate={(d) => {
              console.log(d);
              props.setNewPatDOB(d);
            }}
          />

          <div>Poids</div>
          <input
            className={StyleInputText}
            value={props.newPatPoids}
            onChange={(e) => props.setNewPatPoids(e.target.value)}
            type="number"
          />
          <div>Taille</div>
          <input
            className={StyleInputText}
            value={props.newPatTaille}
            onChange={(e) => props.setNewPatTaille(e.target.value)}
            type="Number"
          />
        </details>

        {props.updateID && (
          <details className="info-blk w-full">
            <summary className={StyleFormBlockTitle()}>Payment</summary>

            {showFormNewMed && (
              <div className="CONT-NEW_PAYMENT  p-2 shadow outline outline-[1px]">
                <p className="text-sm font-bold text-sky-500">
                  NOUVEAU PAYEMENT
                </p>
                <form>
                  <div>
                    <select
                      onChange={(e) =>
                        setNewPayment((old) => ({
                          ...old,
                          type: e.target.value,
                        }))
                      }
                      value={newPayment.type}
                      className={StyleInputText}
                    >
                      <option value="-">- Type de payement -</option>
                      {PAYMENTS_TYPES.map(
                        (p, i) =>
                          p.code !== "DEP" && (
                            <option value={p.code}>{p.label}</option>
                          )
                      )}
                    </select>
                  </div>

                  <div>
                    <input
                      onChange={(e) =>
                        setNewPayment((old) => ({
                          ...old,
                          amount: Number.parseFloat(e.target.value),
                        }))
                      }
                      value={newPayment.amount}
                      className={StyleInputText}
                      type="number"
                      placeholder="Montant"
                    />
                  </div>

                  <div>
                    <div>
                      <input
                        type="checkbox"
                        checked={newPayment.cash}
                        onChange={(e) =>
                          setNewPayment((old) => ({
                            ...old,
                            cash: e.target.checked,
                            payed: e.target.checked,
                          }))
                        }
                      />
                      CASH{" "}
                      <span className="text-neutral-400">
                        (Veuillez cocher si c'est paye cash!)
                      </span>
                    </div>
                    {!newPayment.cash && (
                      <div className="bg-red-500 p-1 font-bold text-xs text-white rounded-md w-fit">
                        CREDIT: La facture sera paye ulterieurement.
                      </div>
                    )}
                    {newPayment.cash && (
                      <div className="bg-green-500 p-1 font-bold text-xs text-white rounded-md w-fit">
                        CASH: La facture est paye cash!
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => setShowFormNewMed(false)}
                    className="text-red-500 my-4 rounded-md border border-transparent hover:border hover:border-red-500 p-1"
                  >
                    ANNULER
                  </button>

                  {newPayment.amount >= 100 && (
                    <button
                      type="button"
                      onClick={onSaveNewPayement}
                      className={clBtn}
                    >
                      ENREGISTRER PAYMENT
                    </button>
                  )}
                </form>
              </div>
            )}

            {!showFormNewMed && (
              <div className="CONT-PAYMENTS-ALL outline-neutral-400 outline-[1px] outline-dashed p-2 ">
                {props.user.level <= 1 && (
                  <button
                    onClick={(e) => setShowFormNewMed(true)}
                    className={clBtn}
                  >
                    NOUVEAU PAYEMENT
                  </button>
                )}
                <p className="font-bold text-sm text-sky-500">
                  TABLEAU PAYEMENT
                </p>
                <table className="w-full hidden md:block">
                  <thead>
                    <tr>
                      {[
                        "No",
                        "Amount",
                        "Type",
                        "CASH/CREDIT.",
                        "Deja Paye",
                        "Date/Heure",
                        "Paye le",
                        "Confirmer Payement",
                      ].map((it, i) => (
                        <td className={` ${cltd} w-min `}>{it}</td>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p, i) => (
                      <tr
                        key={i}
                        className={` ${!p.payed ? "text-red-500 italic" : ""} `}
                      >
                        <td className={cltd}>{i + 1}</td>
                        <td className={cltd}>
                          {FormatNumberWithCommas(p.amount)}
                          {" FC"}
                        </td>
                        <td className={cltd}>{p.type}</td>
                        <td className={cltd}>
                          {p.cash ? (
                            <span>
                              {" "}
                              <img src={cash} width={30} />
                              CASH
                            </span>
                          ) : (
                            <span>
                              {" "}
                              <img src={debt} width={30} />
                              CREDIT
                            </span>
                          )}
                        </td>
                        <td className={cltd}>
                          {!p.payed ? (
                            <img src={close} width={30} />
                          ) : (
                            <img src={check} width={30} />
                          )}
                        </td>
                        <td className={cltd}>
                          {FormatDate(new Date(p.created_at))}
                        </td>
                        <td className={cltd}>
                          {p.payed_at && FormatDate(new Date(p.payed_at))}
                        </td>
                        <td className={cltd}>
                          {p.payed ? (
                            <img src={ok} width={30} />
                          ) : (
                            <>
                              <button
                                className={clBtn}
                                onClick={(e) => onConfirmPayment(p)}
                              >
                                CONFIRMER
                              </button>
                            </>
                          )}
                          <button
                            className={clBtn}
                            onClick={(e) => onDeletePayment(p)}
                          >
                            SUPPRIMER
                          </button>
                        </td>
                      </tr>
                    ))}
                    <tr className="font-bold bg-neutral-100">
                      <td className={cltd}>TOTAL</td>
                      <td className={cltd} colSpan={7}>
                        {FormatNumberWithCommas(
                          payments.reduce((sum, record) => {
                            if (record.payed == true) {
                              return sum + record.amount;
                            }
                            return 0 + sum;
                          }, 0)
                        )}{" "}
                        {"FC"}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={4}>
                        {" "}
                        <Link to={"/lalouise/finances"}>
                          Page Finances
                        </Link>{" "}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="PAYMENTS md:hidden ">
                  <div className="my-2 border-b">
                    {payments.map((p, i) => (
                      <div
                        className={`flex gap-4 ${
                          !p.payed ? "text-red-500" : ""
                        } `}
                      >
                        <div className="text-slate-600">{i + 1}.</div>
                        <div className="flex flex-col ">
                          <div className="text-lg font-bold">{p.amount} FC</div>
                          <div className="text-sm flex gap-2">
                            {" "}
                            {p.cash ? <img src={cash} width={20} /> : "CREDIT"},{" "}
                            {p.payed ? (
                              <img src={check} width={20} />
                            ) : (
                              <>
                                NON PAYE,{" "}
                                <button
                                  className={clBtn}
                                  onClick={(e) => onConfirmPayment(p)}
                                >
                                  CONFIRMER
                                </button>
                              </>
                            )}{" "}
                          </div>
                          <div className="text-slate-500 text-sm">
                            {p.payed && !p.cash && (
                              <div>
                                {" "}
                                Paye le : {FormatDate(new Date(p.payed_at))}
                              </div>
                            )}
                            {p.cash && (
                              <div>
                                Cash paye le :{" "}
                                {FormatDate(new Date(p.created_at))}{" "}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-neutral-300 font-bold text-lg">
                    TOTAL :{" "}
                    {FormatNumberWithCommas(
                      payments.reduce((sum, record) => {
                        if (record.payed == true) {
                          return sum + record.amount;
                        }
                        return 0 + sum;
                      }, 0)
                    )}{" "}
                    {"FC"}
                  </div>
                </div>
              </div>
            )}
          </details>
        )}

        <details className="info-blk w-full">
          <summary className={StyleFormBlockTitle()}>Contact d'urgence</summary>
          <div>Nom</div>
          <input
            className={StyleInputText}
            value={props.emergNom}
            onChange={(e) => props.setEmergNom(e.target.value)}
            type="text"
          />
          <div>Phone</div>
          <input
            className={StyleInputText}
            value={props.emergPhone}
            onChange={(e) => props.setEmergPhone(e.target.value)}
            type="tel"
          />
          <div>Addresse</div>
          <input
            className={StyleInputText}
            value={props.emergAdd}
            onChange={(e) => props.setEmergAdd(e.target.value)}
            type="text"
          />
        </details>

        <details className="info-blk w-full">
          <summary className={StyleFormBlockTitle()}>
            Historique Medical
          </summary>
          <div>
            <input
              type="checkbox"
              value={props.vaccVaricelle}
              checked={props.vaccVaricelle}
              onChange={(e) => props.setVaccVaricelle(e.target.checked)}
            />
            Vaccin Varicelle
          </div>
          <div>
            <input
              type="checkbox"
              value={props.vaccMeasles}
              checked={props.vaccMeasles}
              onChange={(e) => props.setVaccMeasles(e.target.checked)}
            />
            Vaccin Measles
          </div>
          <div>
            <input
              type="checkbox"
              value={props.hepC}
              checked={props.hepC}
              onChange={(e) => props.setHepC(e.target.checked)}
            />
            Avez-vous deja eu l'Hpeatite C
          </div>

          <h5>Autres Maladies</h5>
          <textarea
            className={StyleInputText}
            value={props.autre}
            onChange={(e) => props.setAutre(e.target.value)}
          ></textarea>
        </details>
      </div>
      {!props.editing && dobisvalid && (
        <button
          className={`cool p-1 m-1 rounded-[6pt] text-sm px-4 mx-4 hover:bg-green-500 hover:text-white text-green-500  border border-green-500 `}
          onClick={props.onSaveNewPat}
        >
          ENREGISTRER
        </button>
      )}
      {props.editing && (
        <button
          className={StyleButton("green-500")}
          onClick={(e) => props.onUpdatePat(props.updateID)}
        >
          UPDATE
        </button>
      )}
      {props.editing && (
        <button
          className={`cool p-1 m-1 rounded-[6pt] text-sm px-4 mx-4 hover:bg-red-500 hover:text-white text-red-500  border border-red-500 `}
          onClick={(e) => props.onDelPat(props.updateID)}
        >
          DELETE RECORD
        </button>
      )}
      <button
        className={`cool p-1 m-1 rounded-[6pt] text-sm px-4 mx-4 hover:bg-gray-500 hover:text-white text-gray-500  border border-gray-500 `}
        onClick={props.onCancel}
      >
        ANNULER
      </button>
      <button
        className={`cool p-1 m-1 rounded-[6pt] text-sm px-4 mx-4 hover:bg-gray-500 hover:text-white text-gray-500  border border-gray-500 `}
        onClick={(e) => onSortieHopital()}
      >
        SORTIE HOPITAL
      </button>
      <ProgressView show={loading} />
    </>
  );
}
