const EntityVersion =
  require(
    '../models/EntityVersion'
  )

exports.restore =
  async (req, res) => {

    try {

      const {

        entity,

        entity_id,

      } = req.body

      const lastVersion =
        await EntityVersion
          .findOne({

            entity,

            entity_id,

          })
          .sort({
            version: -1,
          })

      if (!lastVersion) {

        return response.error(res, {

          code: 404,

          message:
            'Version not found',

        })

      }

      // DYNAMIC MODEL

      let Model

      switch (entity) {

        case 'PATIENT':

          Model =
            require(
              '../models/Patient'
            )

          break

        default:

          return response.error(res, {

            message:
              'Entity not supported',

          })

      }

      const restoredData =
        await Model
          .findByIdAndUpdate(

            entity_id,

            {

              ...lastVersion
                .snapshot,

              current_version:
                lastVersion.version + 1,

            },

            {
              new: true,
            }

          )

      return response.success(res, {

        message:
          'Data restored',

        data:
          restoredData,

      })

    } catch (err) {

      return response.error(res, {

        message:
          err.message,

      })

    }

  }