export const adminWelcomeTemplate = ({
  firstname,
  lastname,
  email,
  password,
  dashboardUrl,
}) => `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Accès administrateur - Vodun Days</title>
</head>
<body style="margin:0;padding:0;background:#0f0f0f;font-family:Arial,sans-serif;color:#e5e5e5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f0f;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border-radius:8px;overflow:hidden;max-width:600px;width:100%;">

          <!-- En-tête -->
          <tr>
            <td style="background:#b5862d;padding:32px 40px;">
              <p style="margin:0;font-size:22px;font-weight:bold;color:#0f0f0f;letter-spacing:1px;">VODUN DAYS</p>
              <p style="margin:6px 0 0;font-size:13px;color:#0f0f0f;opacity:0.7;">Plateforme d'administration</p>
            </td>
          </tr>

          <!-- Corps -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 24px;font-size:16px;">Bonjour <strong>${firstname} ${lastname}</strong>,</p>
              <p style="margin:0 0 24px;font-size:14px;line-height:1.7;color:#aaa;">
                Un compte administrateur a ete cree pour vous sur la plateforme Vodun Days.
                Voici vos coordonnees d'acces :
              </p>

              <!-- Bloc identifiants -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#252525;border-radius:6px;margin-bottom:32px;">
                <tr>
                  <td style="padding:24px 28px;">
                    <p style="margin:0 0 12px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#b5862d;">Identifiants de connexion</p>
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:6px 0;font-size:13px;color:#888;width:120px;">Adresse email</td>
                        <td style="padding:6px 0;font-size:13px;color:#e5e5e5;font-family:monospace;">${email}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;font-size:13px;color:#888;">Mot de passe</td>
                        <td style="padding:6px 0;font-size:13px;color:#e5e5e5;font-family:monospace;">${password}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Bouton -->
              <table cellpadding="0" cellspacing="0" style="margin-bottom:36px;">
                <tr>
                  <td style="background:#b5862d;border-radius:5px;">
                    <a href="${dashboardUrl}" style="display:inline-block;padding:12px 28px;font-size:14px;font-weight:bold;color:#0f0f0f;text-decoration:none;">
                      Acceder au tableau de bord
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Regles -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#1e1e1e;border-left:3px solid #b5862d;border-radius:0 6px 6px 0;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 12px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#b5862d;">Regles du compte</p>
                    <ul style="margin:0;padding-left:18px;font-size:13px;line-height:1.9;color:#aaa;">
                      <li>Changez votre mot de passe des votre premiere connexion.</li>
                      <li>Ne partagez jamais vos identifiants avec un tiers.</li>
                      <li>L'acces est strictement limite a vos fonctions dans le cadre de Vodun Days.</li>
                      <li>Toute action effectuee sur la plateforme est tracee et auditee.</li>
                      <li>En cas de suspicion de compromission, contactez immediatement un superadministrateur.</li>
                    </ul>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:12px;color:#555;line-height:1.6;">
                Cet email a ete genere automatiquement par la plateforme Vodun Days. Ne pas repondre a ce message.
              </p>
            </td>
          </tr>

          <!-- Pied de page -->
          <tr>
            <td style="background:#111;padding:20px 40px;border-top:1px solid #2a2a2a;">
              <p style="margin:0;font-size:11px;color:#444;text-align:center;">Vodun Days - Cotonou, Benin</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
